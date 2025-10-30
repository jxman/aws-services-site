import { useState } from 'react';

function ChangeCard({ entry, servicesData }) {
  const { changes } = entry;
  const hasNewServices = changes.newServices && changes.newServices.length > 0;
  const hasRegionalServices = changes.newRegionalServices && changes.newRegionalServices.length > 0;
  const hasNewRegions = changes.newRegions && changes.newRegions.length > 0;
  const [expandedServices, setExpandedServices] = useState({});

  // Group regional services by service code
  const groupedRegionalServices = changes.newRegionalServices?.reduce((acc, item) => {
    if (!acc[item.service]) {
      acc[item.service] = {
        code: item.service,
        name: servicesData[item.service]?.name || item.service,
        regions: []
      };
    }
    acc[item.service].regions.push(item.region);
    return acc;
  }, {}) || {};

  return (
    <div className="space-y-2">
      {/* New Services */}
      {hasNewServices && (
        <>
          {changes.newServices.map((service) => (
            <div
              key={service.code}
              className="flex items-start gap-3 py-2 border-b border-border-light dark:border-border last:border-0"
            >
              <span className="flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900">
                <svg className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-text-light-primary dark:text-text-primary">
                  {service.name}
                </div>
                <div className="text-xs text-text-light-secondary dark:text-text-secondary mt-0.5">
                  New service: {service.code}
                </div>
              </div>
            </div>
          ))}
        </>
      )}

      {/* Regional Expansions */}
      {hasRegionalServices && (
        <>
          {Object.entries(groupedRegionalServices).map(([serviceCode, serviceData]) => {
            const regionCount = serviceData.regions.length;
            const displayRegions = regionCount <= 3
              ? serviceData.regions.join(', ')
              : `${regionCount} regions`;
            const isExpanded = expandedServices[serviceCode];

            return (
              <div
                key={serviceCode}
                className="flex items-start gap-3 py-2 border-b border-border-light dark:border-border last:border-0"
              >
                <span className="flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 dark:bg-green-900">
                  <svg className="w-3.5 h-3.5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v.878A2.996 2.996 0 0110 16a2.996 2.996 0 01-3-2.122V13a2 2 0 00-2-2H4.332z" clipRule="evenodd" />
                  </svg>
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-text-light-primary dark:text-text-primary">
                    {serviceData.name}
                  </div>
                  <div className="text-xs text-text-light-secondary dark:text-text-secondary mt-0.5">
                    Expanded to {displayRegions}
                  </div>
                  {regionCount > 3 && (
                    <div className="relative mt-1">
                      {isExpanded ? (
                        <div className="text-xs text-text-light-secondary dark:text-text-secondary">
                          <div className="bg-bg-light-tertiary dark:bg-bg-tertiary rounded p-2 border border-border-light dark:border-border">
                            <div className="font-medium mb-1">All {regionCount} regions:</div>
                            <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                              {serviceData.regions.map((region, idx) => (
                                <div key={idx} className="flex items-center gap-1">
                                  <span className="text-green-600 dark:text-green-400">✓</span>
                                  <span>{region}</span>
                                </div>
                              ))}
                            </div>
                            <button
                              onClick={() => setExpandedServices(prev => ({ ...prev, [serviceCode]: false }))}
                              className="mt-2 text-xs text-primary hover:underline"
                            >
                              Show less ▲
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-text-light-secondary dark:text-text-secondary">
                          {serviceData.regions.slice(0, 3).join(', ')},{' '}
                          <button
                            onClick={() => setExpandedServices(prev => ({ ...prev, [serviceCode]: true }))}
                            className="text-primary hover:underline cursor-pointer"
                          >
                            +{regionCount - 3} more
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </>
      )}

      {/* New Regions */}
      {hasNewRegions && (
        <>
          {changes.newRegions.map((region) => (
            <div
              key={region}
              className="flex items-start gap-3 py-2 border-b border-border-light dark:border-border last:border-0"
            >
              <span className="flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900">
                <svg className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-text-light-primary dark:text-text-primary">
                  New Region Available
                </div>
                <div className="text-xs text-text-light-secondary dark:text-text-secondary mt-0.5">
                  {region}
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default ChangeCard;
