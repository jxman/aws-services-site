# Deployment Guide

## Quick Deploy (Automated)

```bash
./deploy.sh
```

This script will:
1. Build production bundle
2. Backup current site
3. Upload to S3 (preserving `/data/` and `/reports/`)
4. Set cache headers
5. Invalidate CloudFront cache
6. Wait for completion

---

## Manual Deploy Steps

### 1. Build
```bash
npm run build
```

### 2. Upload to S3
```bash
aws s3 sync dist/ s3://www.aws-services.synepho.com/ \
  --exclude "data/*" \
  --exclude "reports/*" \
  --delete
```

### 3. Set Cache Headers
```bash
aws s3 cp s3://www.aws-services.synepho.com/index.html \
  s3://www.aws-services.synepho.com/index.html \
  --cache-control "no-cache,no-store,must-revalidate" \
  --content-type "text/html" \
  --metadata-directive REPLACE
```

### 4. Invalidate CloudFront
```bash
aws cloudfront create-invalidation \
  --distribution-id EBTYLWOK3WVOK \
  --paths "/*"
```

### 5. Verify
```bash
# Check site is live
curl -I https://aws-services.synepho.com

# Check data is accessible
curl -I https://aws-services.synepho.com/data/complete-data.json

# Check S3 bucket contents
aws s3 ls s3://www.aws-services.synepho.com/ --recursive
```

---

## Rollback

If you need to rollback to a previous version:

```bash
# Restore from backup (backups saved in /tmp/aws-dashboard-backups/)
aws s3 cp /tmp/aws-dashboard-backups/backup-YYYYMMDD-HHMMSS.html \
  s3://www.aws-services.synepho.com/index.html

# Invalidate CloudFront
aws cloudfront create-invalidation \
  --distribution-id EBTYLWOK3WVOK \
  --paths "/*"
```

---

## Important Notes

### Files to Preserve
- `/data/*` - AWS infrastructure data (updated by fetcher Lambda)
- `/reports/*` - Excel reports (updated by reporter Lambda)

### Cache Strategy
- **index.html**: `no-cache,no-store,must-revalidate` (always fresh)
- **Assets (JS/CSS)**: Default S3 cache headers (cacheable with unique filenames)
- **/data/**: `public, max-age=300` (5 minutes)
- **/reports/**: `public, max-age=300` (5 minutes)

### CloudFront Distribution
- **ID**: EBTYLWOK3WVOK
- **Domain**: aws-services.synepho.com
- **SSL**: Valid ACM certificate
- **Invalidation**: Usually completes in 1-2 minutes

### S3 Bucket
- **Name**: www.aws-services.synepho.com
- **Region**: us-east-1
- **Website Hosting**: Enabled
- **CloudFront Origin**: Configured

---

## Troubleshooting

### Site shows old version after deploy
```bash
# Force clear browser cache (Cmd+Shift+R on Mac)
# Or wait 1-2 minutes for CloudFront invalidation to complete

# Check invalidation status
aws cloudfront get-invalidation \
  --distribution-id EBTYLWOK3WVOK \
  --id <INVALIDATION_ID>
```

### Data not loading
```bash
# Verify data files exist in S3
aws s3 ls s3://www.aws-services.synepho.com/data/

# Check CORS configuration
aws s3api get-bucket-cors --bucket www.aws-services.synepho.com

# Test data fetch
curl https://aws-services.synepho.com/data/complete-data.json | jq '.metadata'
```

### Build errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf dist .vite

# Rebuild
npm run build
```

---

## Deployment Checklist

Before deploying:
- [ ] Test locally (`npm run dev`)
- [ ] Build successfully (`npm run build`)
- [ ] Run linter (`npm run lint`)
- [ ] No ESLint errors
- [ ] Browser console shows no errors
- [ ] All routes work correctly (Dashboard, Regions, Services, Coverage, Reports, About)
- [ ] Data loads from `/data/complete-data.json`
- [ ] Search and filter functionality works
- [ ] CSV exports work correctly
- [ ] Detail modals open and display data

After deploying:
- [ ] Site loads at https://aws-services.synepho.com
- [ ] Dashboard shows real data and key metrics
- [ ] All navigation links work (6 pages total)
- [ ] Data fetches successfully
- [ ] Excel download link works in Reports center
- [ ] CSV exports work (Regions, Services, Coverage, custom exports)
- [ ] Detail modals work for regions and services
- [ ] Search functionality works on Regions and Services pages
- [ ] Coverage matrix displays correctly
- [ ] Mobile responsive design works
- [ ] No console errors in production

---

## Development Workflow

Standard development and deployment workflow:

```bash
# 1. Develop locally
npm run dev

# 2. Test thoroughly
# - Test all views and features
# - Verify data fetching works
# - Test search and filter functionality
# - Test CSV and Excel exports
# - Check responsive design on mobile/tablet
# - Verify detail modals work correctly

# 3. Run linter
npm run lint

# 4. Build for production
npm run build

# 5. Preview production build (optional)
npm run preview

# 6. Deploy to production
./deploy.sh

# 7. Verify production
# - Visit all routes (Dashboard, Regions, Services, Coverage, Reports, About)
# - Test data loading
# - Test exports and modals
# - Check browser console for errors
# - Verify mobile responsive design
```

---

**Last Deployed**: 2025-10-23
**Version**: 2.0.0 (Complete Application)
**Status**: ✅ Production
