#!/bin/bash

# AWS Services Dashboard - Deployment Script
# Opens the deployed site in the default browser when done.
# Usage: ./scripts/deploy.sh [options] (or npm run deploy)
#
# Options:
#   --dry-run       Build and show what would sync, without uploading, backing up, or invalidating
#   --skip-build    Reuse the existing dist/ directory instead of rebuilding
#   --yes           Skip the production confirmation prompt
#   -h, --help      Show this help message

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
S3_BUCKET="www.aws-services.synepho.com"
CLOUDFRONT_DIST_ID="EBTYLWOK3WVOK"
BACKUP_DIR="/tmp/aws-dashboard-backups"
SITE_URL="https://aws-services.synepho.com"

# Move to repo root regardless of where the script is invoked from
cd "$(dirname "$0")/.."

# Flags
DRY_RUN=false
SKIP_BUILD=false
ASSUME_YES=false

show_help() {
  echo "Usage: $0 [options]"
  echo ""
  echo "Options:"
  echo "  --dry-run       Build and show what would sync, without uploading, backing up, or invalidating"
  echo "  --skip-build    Reuse the existing dist/ directory instead of rebuilding"
  echo "  --yes           Skip the production confirmation prompt"
  echo "  -h, --help      Show this help message"
}

for arg in "$@"; do
  case $arg in
    --dry-run) DRY_RUN=true ;;
    --skip-build) SKIP_BUILD=true ;;
    --yes) ASSUME_YES=true ;;
    -h|--help) show_help; exit 0 ;;
    *)
      echo -e "${RED}[ERROR]${NC} Unknown option: $arg"
      show_help
      exit 1
      ;;
  esac
done

check_prerequisites() {
  echo -e "${BLUE}🔎 Checking prerequisites...${NC}"

  if ! command -v aws &> /dev/null; then
    echo -e "${RED}[ERROR]${NC} AWS CLI is not installed. Please install it first."
    exit 1
  fi

  if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}[ERROR]${NC} AWS credentials not configured or invalid."
    echo -e "${BLUE}[INFO]${NC} Run 'aws configure' or set AWS environment variables."
    exit 1
  fi

  echo -e "${GREEN}✅ All prerequisites met${NC}"
  echo ""
}

show_config() {
  echo -e "${BLUE}Deployment Configuration:${NC}"
  echo "  S3 Bucket: $S3_BUCKET"
  echo "  CloudFront Distribution: $CLOUDFRONT_DIST_ID"
  echo "  Site URL: $SITE_URL"
  echo "  AWS Account: $(aws sts get-caller-identity --query Account --output text)"
  echo "  Dry Run: $DRY_RUN"
  echo ""
}

confirm_production() {
  if [ "$ASSUME_YES" = true ] || [ "$DRY_RUN" = true ]; then
    return
  fi

  echo -e "${YELLOW}⚠️  You are about to deploy to PRODUCTION: $SITE_URL${NC}"
  read -p "Type 'yes' to continue: " confirm
  if [ "$confirm" != "yes" ]; then
    echo "Deployment cancelled."
    exit 0
  fi
  echo ""
}

echo "🚀 AWS Services Dashboard - Deployment"
echo "========================================"
echo ""

check_prerequisites
show_config
confirm_production

# Step 1: Build
if [ "$SKIP_BUILD" = true ]; then
  echo -e "${YELLOW}⚠️  Skipping build (--skip-build)${NC}"
  echo ""
else
  echo -e "${BLUE}📦 Step 1: Building production bundle...${NC}"
  npm run build
  echo -e "${GREEN}✅ Build completed successfully${NC}"
  echo ""
fi

if [ ! -f "dist/index.html" ]; then
  echo -e "${RED}[ERROR]${NC} Build output not found at ./dist/index.html"
  exit 1
fi

# 404.html, sitemap.xml, and per-route index.html files come from scripts/prerender.mjs (run by npm run build)
for REQUIRED in dist/404.html dist/sitemap.xml dist/regions/index.html dist/services/index.html; do
  if [ ! -f "$REQUIRED" ]; then
    echo -e "${RED}[ERROR]${NC} Prerendered output missing: $REQUIRED (did the prerender step run?)"
    exit 1
  fi
done

if [ "$DRY_RUN" = true ]; then
  echo -e "${YELLOW}⚠️  Dry run: showing what would sync, no upload/backup/invalidation will occur${NC}"
  echo ""
  echo -e "${BLUE}☁️  Step 2: Previewing S3 sync...${NC}"
  aws s3 sync dist/assets "s3://$S3_BUCKET/assets" --dryrun
  aws s3 sync dist/ "s3://$S3_BUCKET/" \
    --dryrun \
    --exclude "assets/*" \
    --exclude "data/*" \
    --exclude "reports/*" \
    --include "reports/index.html" \
    --delete
  echo ""
  echo -e "${GREEN}✅ Dry run complete — no changes were made${NC}"
  exit 0
fi

# Step 2: Backup
echo -e "${BLUE}💾 Step 2: Creating backup...${NC}"
mkdir -p "$BACKUP_DIR"
BACKUP_FILE="$BACKUP_DIR/backup-$(date +%Y%m%d-%H%M%S).html"
aws s3 cp "s3://$S3_BUCKET/index.html" "$BACKUP_FILE" || echo -e "${YELLOW}⚠️  No existing index.html to backup${NC}"
echo -e "${GREEN}✅ Backup saved: $BACKUP_FILE${NC}"
echo ""

# Step 3: Upload hashed assets first (long cache), so new HTML never references missing files
echo -e "${BLUE}☁️  Step 3: Uploading hashed assets...${NC}"
aws s3 sync dist/assets "s3://$S3_BUCKET/assets" \
  --cache-control "public,max-age=31536000,immutable"
echo -e "${GREEN}✅ Assets uploaded${NC}"
echo ""

# Step 4: Upload prerendered HTML and other root files (no cache), then prune old assets.
# data/* and reports/* are written by other services; only the /reports page itself is ours.
echo -e "${BLUE}☁️  Step 4: Uploading pages and pruning stale files...${NC}"
aws s3 sync dist/ "s3://$S3_BUCKET/" \
  --exclude "assets/*" \
  --exclude "data/*" \
  --exclude "reports/*" \
  --include "reports/index.html" \
  --cache-control "public,max-age=0,must-revalidate" \
  --delete
aws s3 sync dist/assets "s3://$S3_BUCKET/assets" --delete --size-only
echo -e "${GREEN}✅ Pages uploaded${NC}"
echo ""

# Step 5: Invalidate CloudFront
echo -e "${BLUE}🔄 Step 5: Invalidating CloudFront cache...${NC}"
INVALIDATION_ID=$(aws cloudfront create-invalidation \
  --distribution-id "$CLOUDFRONT_DIST_ID" \
  --paths "/*" \
  --query 'Invalidation.Id' \
  --output text)

echo -e "${GREEN}✅ Invalidation created: $INVALIDATION_ID${NC}"
echo ""

# Wait for invalidation (optional)
echo -e "${BLUE}⏳ Waiting for invalidation to complete...${NC}"
aws cloudfront wait invalidation-completed \
  --distribution-id "$CLOUDFRONT_DIST_ID" \
  --id "$INVALIDATION_ID" && \
  echo -e "${GREEN}✅ Invalidation completed${NC}"

# Step 6: Site verification
echo ""
echo -e "${BLUE}🔍 Step 6: Running site verification...${NC}"
VERIFY_FAILED=0

# Check main page
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL")
RESPONSE_TIME=$(curl -s -o /dev/null -w "%{time_total}" "$SITE_URL")
if [ "$HTTP_STATUS" = "200" ]; then
  echo -e "  ${GREEN}✅ Main page: HTTP $HTTP_STATUS (${RESPONSE_TIME}s)${NC}"
else
  echo -e "  ${YELLOW}⚠️  Main page: HTTP $HTTP_STATUS (${RESPONSE_TIME}s)${NC}"
  VERIFY_FAILED=1
fi

# Check SPA routes
for ROUTE in "/regions" "/services" "/coverage" "/whats-new" "/about" "/regions/us-east-1" "/services/lambda" "/sitemap.xml"; do
  ROUTE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL$ROUTE")
  ROUTE_TIME=$(curl -s -o /dev/null -w "%{time_total}" "$SITE_URL$ROUTE")
  if [ "$ROUTE_STATUS" = "200" ]; then
    echo -e "  ${GREEN}✅ $ROUTE: HTTP $ROUTE_STATUS (${ROUTE_TIME}s)${NC}"
  else
    echo -e "  ${YELLOW}⚠️  $ROUTE: HTTP $ROUTE_STATUS (${ROUTE_TIME}s)${NC}"
    VERIFY_FAILED=1
  fi
done

# Detail pages must be served from their own prerendered file, not the homepage fallback
REGION_TITLE=$(curl -s "$SITE_URL/regions/us-east-1" | grep -o '<title>[^<]*</title>')
if echo "$REGION_TITLE" | grep -q "us-east-1"; then
  echo -e "  ${GREEN}✅ Prerendered region page served: $REGION_TITLE${NC}"
else
  echo -e "  ${YELLOW}⚠️  /regions/us-east-1 is not serving its prerendered page (got: $REGION_TITLE) — is the CloudFront URL-rewrite function attached?${NC}"
  VERIFY_FAILED=1
fi

# Unknown URLs should return a real 404, not a soft-404 200
MISSING_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL/this-page-does-not-exist")
if [ "$MISSING_STATUS" = "404" ]; then
  echo -e "  ${GREEN}✅ Unknown URL: HTTP 404${NC}"
else
  echo -e "  ${YELLOW}⚠️  Unknown URL: HTTP $MISSING_STATUS (expected 404)${NC}"
  VERIFY_FAILED=1
fi

# Check data API endpoint
DATA_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL/data/complete-data.json")
DATA_TIME=$(curl -s -o /dev/null -w "%{time_total}" "$SITE_URL/data/complete-data.json")
if [ "$DATA_STATUS" = "200" ]; then
  echo -e "  ${GREEN}✅ Data API: HTTP $DATA_STATUS (${DATA_TIME}s)${NC}"
else
  echo -e "  ${YELLOW}⚠️  Data API: HTTP $DATA_STATUS (${DATA_TIME}s)${NC}"
  VERIFY_FAILED=1
fi

# Check static assets (CSS/JS from built bundle)
INDEX_CONTENT=$(curl -s "$SITE_URL")
CSS_FILE=$(echo "$INDEX_CONTENT" | grep -o 'href="/assets/[^"]*\.css"' | head -1 | sed 's/href="//;s/"//')
JS_FILE=$(echo "$INDEX_CONTENT" | grep -o 'src="/assets/[^"]*\.js"' | head -1 | sed 's/src="//;s/"//')

if [ -n "$CSS_FILE" ]; then
  CSS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL$CSS_FILE")
  CSS_TIME=$(curl -s -o /dev/null -w "%{time_total}" "$SITE_URL$CSS_FILE")
  echo -e "  ${GREEN}✅ CSS bundle: HTTP $CSS_STATUS (${CSS_TIME}s)${NC}"
fi

if [ -n "$JS_FILE" ]; then
  JS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL$JS_FILE")
  JS_TIME=$(curl -s -o /dev/null -w "%{time_total}" "$SITE_URL$JS_FILE")
  echo -e "  ${GREEN}✅ JS bundle: HTTP $JS_STATUS (${JS_TIME}s)${NC}"
fi

echo ""

# Final summary
if [ "$VERIFY_FAILED" = "0" ]; then
  echo -e "${GREEN}========================================${NC}"
  echo -e "${GREEN}🎉 Deployment Complete - All checks passed!${NC}"
  echo -e "${GREEN}========================================${NC}"
else
  echo -e "${YELLOW}========================================${NC}"
  echo -e "${YELLOW}⚠️  Deployment Complete - Some checks failed${NC}"
  echo -e "${YELLOW}========================================${NC}"
fi

echo ""
echo -e "🌐 Your site is live at: ${BLUE}$SITE_URL${NC}"
echo ""
echo -e "${YELLOW}🔙 Rollback (if needed):${NC}"
echo "  aws s3 cp $BACKUP_FILE s3://$S3_BUCKET/index.html"
echo ""

if command -v open &> /dev/null; then
  open "$SITE_URL"
fi
