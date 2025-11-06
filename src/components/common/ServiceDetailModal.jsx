import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useAWSData } from '../../hooks/useAWSData';
import { formatNumber, formatPercentage } from '../../utils/formatters';

function ServiceDetailModal({ isOpen, onClose, service, regions }) {
  const { data } = useAWSData();

  if (!service) return null;

  // Build region lookup from API data
  const regionLookup = (data?.regions?.regions || []).reduce((acc, region) => {
    acc[region.code] = region;
    return acc;
  }, {});

  const exportToCSV = () => {
    const sortedRegions = regions
      .map(code => {
        const region = regionLookup[code];
        return {
          code,
          name: region?.name || code,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    // Build CSV with summary section at top
    const summarySection = [
      ['AWS Service Report'],
      [''],
      ['Service Name', service.name],
      ['Service Code', service.code],
      ['Available Regions', service.availableRegions],
      ['Total Regions', service.totalRegions],
      ['Coverage', formatPercentage(service.coverage)],
      [''],
      ['Generated', new Date().toISOString().split('T')[0]],
      [''],
      [''],
    ];

    const headers = ['Region Name', 'Region Code'];
    const rows = sortedRegions.map(region => [region.name, region.code]);

    const csvContent = [
      ...summarySection.map(row => row.map(cell => `"${cell}"`).join(',')),
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${service.code}-regions-${new Date().toISOString().split('T')[0]}.csv`;
    link.style.display = 'none';
    link.click();
    URL.revokeObjectURL(url);
  };

  const sortedRegions = regions
    .map(code => {
      const region = regionLookup[code];
      return {
        code,
        name: region?.name || code,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-lg bg-bg-light-secondary dark:bg-bg-secondary border border-border-light dark:border-border shadow-xl transition-all">
                {/* Header */}
                <div className="border-b border-border-light dark:border-border px-6 py-4 flex items-start justify-between">
                  <div className="flex-1">
                    <Dialog.Title className="text-2xl font-bold text-text-light-primary dark:text-text-primary">
                      {service.name}
                    </Dialog.Title>
                    <p className="text-sm text-text-light-secondary dark:text-text-secondary font-mono mt-1">
                      {service.code}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-text-light-secondary dark:text-text-secondary hover:text-text-light-primary dark:hover:text-text-primary transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Details */}
                <div className="px-6 py-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-bg-light-tertiary dark:bg-bg-tertiary rounded-lg p-4">
                      <div className="text-sm text-text-light-secondary dark:text-text-secondary mb-1">Regional Availability</div>
                      <div className="text-lg font-semibold text-text-light-primary dark:text-text-primary">
                        {formatNumber(service.availableRegions)} / {formatNumber(service.totalRegions)} regions
                      </div>
                    </div>

                    <div className="bg-bg-light-tertiary dark:bg-bg-tertiary rounded-lg p-4">
                      <div className="text-sm text-text-light-secondary dark:text-text-secondary mb-1">Coverage</div>
                      <div className="flex items-center gap-3">
                        <div className="text-lg font-semibold text-text-light-primary dark:text-text-primary">
                          {formatPercentage(service.coverage)}
                        </div>
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: service.coverageColor }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Coverage Bar */}
                  <div className="bg-bg-light-tertiary dark:bg-bg-tertiary rounded-lg p-4">
                    <div className="text-sm text-text-light-secondary dark:text-text-secondary mb-2">Regional Distribution</div>
                    <div className="w-full bg-gray-200 dark:bg-bg-primary rounded-full h-3">
                      <div
                        className="h-3 rounded-full transition-all"
                        style={{
                          width: service.coverage + '%',
                          backgroundColor: service.coverageColor,
                        }}
                      />
                    </div>
                  </div>

                  {/* Regions List */}
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-text-light-primary dark:text-text-primary mb-3">
                      Available Regions ({sortedRegions.length})
                    </h3>
                    <div className="bg-bg-light-tertiary dark:bg-bg-tertiary rounded-lg max-h-96 overflow-y-auto">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-px">
                        {sortedRegions.map((region, idx) => (
                          <div
                            key={region.code}
                            className={`px-4 py-3 ${idx % 2 === 0 ? 'bg-bg-light-secondary dark:bg-bg-secondary' : 'bg-bg-light-primary dark:bg-bg-primary'}`}
                          >
                            <div className="text-sm font-medium text-text-light-primary dark:text-text-primary">
                              {region.name}
                            </div>
                            <div className="text-xs text-text-light-secondary dark:text-text-secondary font-mono">
                              {region.code}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t border-border-light dark:border-border px-6 py-4 flex justify-between">
                  <button
                    onClick={exportToCSV}
                    className="px-4 py-2 bg-bg-light-tertiary dark:bg-bg-tertiary text-text-light-primary dark:text-text-primary border border-border-light dark:border-border rounded-lg hover:bg-gray-300 dark:hover:bg-bg-secondary transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export CSV
                  </button>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default ServiceDetailModal;
