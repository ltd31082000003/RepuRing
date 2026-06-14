import React from 'react';
import { motion } from 'framer-motion';
import { CurrentWallet } from '@/components/key-management/CurrentWallet';
import { ImportWallet } from '@/components/key-management/ImportWallet';
import { NewKey } from '@/components/key-management/NewKey';
import { Dialog, DialogContent } from '@/components/ui/Dialog';
import { useDS } from '@/core/useDs';
import { downloadJson } from '@/helpers/download';
import { useToast } from '@/toast/ToastContext';
import { PageHeader } from '@/components/layouts/PageHeader';

type KeyManagementModal = 'import' | 'create' | null;

export const KeyManagement = (): JSX.Element => {
    const toast = useToast();
    const { data: keystore } = useDS('keystore', {});
    const [activeModal, setActiveModal] = React.useState<KeyManagementModal>(null);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1
            }
        }
    };

    const handleDownloadKeys = () => {
        if (!keystore) {
            toast.error({
                title: 'No keys available',
                description: 'Keystore data has not loaded yet.',
            });
            return;
        }

        downloadJson(keystore, 'keystore');
        toast.success({
            title: 'Download started',
            description: 'Your keystore JSON is on its way.',
        });
    };

    return (
        <div className="space-y-6 pb-16 lg:pb-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"
            >
                <PageHeader
                    title="My Account"
                    subtitle="Manage your RepuRing identity, selected wallet, and local demo signing key."
                    className="w-full"
                />
            </motion.div>

            <motion.div
                className="grid grid-cols-1 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <CurrentWallet onDownloadFullKeystore={handleDownloadKeys} onOpenCreate={() => setActiveModal('create')} onOpenImport={() => setActiveModal('import')} />
            </motion.div>

            <Dialog open={activeModal !== null} onOpenChange={(open) => !open && setActiveModal(null)}>
                <DialogContent
                    title={
                        activeModal === 'import'
                                ? 'Import Wallet'
                                : 'Create New Key'
                    }
                    className="max-h-[90vh] max-w-[min(96vw,56rem)] gap-0 overflow-hidden border-[#272729] bg-[#171717] p-0"
                >
                    <div className="max-h-[90vh] overflow-y-auto p-5 sm:p-6">
                        {activeModal === 'import' ? <ImportWallet embedded onSuccess={() => setActiveModal(null)} /> : null}
                        {activeModal === 'create' ? <NewKey embedded onSuccess={() => setActiveModal(null)} /> : null}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};
