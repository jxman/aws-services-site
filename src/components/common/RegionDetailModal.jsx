import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useServiceNames } from '../../hooks/useAWSData';
import { formatDate } from '../../utils/formatters';

function RegionDetailModal({ isOpen, onClose, region, services }) {
  const { data: serviceNamesData } = useServiceNames();

  if (!region) return null;

  const exportToCSV = () => {
    const nameMap = {};
    if (serviceNamesData) {
      serviceNamesData.forEach(service => {
        nameMap[service.code] = service.name;
      });
    }

    const regionServices = services
      .map(code => ({
        code,
        name: nameMap[code] || code,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    // Build CSV with summary section at top
    const summarySection = [
      ['AWS Region Report'],
      [''],
      ['Region Name', region.name],
      ['Region Code', region.code],
      ['Availability Zones', region.availabilityZones],
      ['Launch Date', formatDate(region.launchDate)],
      ['Total Services Available', services.length],
      ...(region.blogUrl ? [['Launch Blog URL', region.blogUrl]] : []),
      [''],
      ['Generated', new Date().toISOString().split('T')[0]],
      [''],
      [''],
    ];

    const headers = ['Service Name', 'Service Code'];
    const rows = regionServices.map(service => [service.name, service.code]);

    const csvContent = [
      ...summarySection.map(row => row.map(cell => `"${cell}"`).join(',')),
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${region.code}-services-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const nameMap = {};
  if (serviceNamesData) {
    serviceNamesData.forEach(service => {
      nameMap[service.code] = service.name;
    });
  }

  const regionServices = services
    .map(code => ({
      code,
      name: nameMap[code] || code,
    }))
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
                      {region.name}
                    </Dialog.Title>
                    <p className="text-sm text-text-light-secondary dark:text-text-secondary font-mono mt-1">
                      {region.code}
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
                      <div className="text-sm text-text-light-secondary dark:text-text-secondary mb-1">Launch Date</div>
                      <div className="text-lg font-semibold text-text-light-primary dark:text-text-primary">
                        {formatDate(region.launchDate)}
                      </div>
                    </div>

                    <div className="bg-bg-light-tertiary dark:bg-bg-tertiary rounded-lg p-4">
                      <div className="text-sm text-text-light-secondary dark:text-text-secondary mb-1">Availability Zones</div>
                      <div className="text-lg font-semibold text-text-light-primary dark:text-text-primary">
                        {region.availabilityZones} AZs
                      </div>
                    </div>

                    <div className="bg-bg-light-tertiary dark:bg-bg-tertiary rounded-lg p-4 md:col-span-2">
                      <div className="text-sm text-text-light-secondary dark:text-text-secondary mb-1">Services Available</div>
                      <div className="text-lg font-semibold text-text-light-primary dark:text-text-primary">
                        {services.length} services
                      </div>
                    </div>

                    {region.blogUrl && (
                      <div className="md:col-span-2">
                        <a
                          href={region.blogUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-primary hover:text-primary-light transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Read Launch Blog Post
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Services List */}
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-text-light-primary dark:text-text-primary mb-3">
                      Available Services ({regionServices.length})
                    </h3>
                    <div className="bg-bg-light-tertiary dark:bg-bg-tertiary rounded-lg max-h-96 overflow-y-auto">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-px">
                        {regionServices.map((service, idx) => (
                          <div
                            key={service.code}
                            className={`px-4 py-3 ${idx % 2 === 0 ? 'bg-bg-light-secondary dark:bg-bg-secondary' : 'bg-bg-light-primary dark:bg-bg-primary'}`}
                          >
                            <div className="text-sm font-medium text-text-light-primary dark:text-text-primary">
                              {service.name}
                            </div>
                            <div className="text-xs text-text-light-secondary dark:text-text-secondary font-mono">
                              {service.code}
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

export default RegionDetailModal;
