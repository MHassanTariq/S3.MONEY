'use client';

import { FC, HTMLAttributes, useCallback, useMemo, useState } from 'react';
import { useAutoConnectWallet, useCurrentAccount, useCurrentWallet, useDisconnectWallet } from '@mysten/dapp-kit';
import NextImage from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { twMerge } from 'tailwind-merge';

import LogoIcon from '@/../public/images/logo.svg?jsx';
import LogoutIcon from '@/../public/images/logout.svg?jsx';

import { Loader } from '@/Components/Loader';
import { LogoutModal } from '@/Components/LogoutModal';

import { PAGES_URLS } from '@/utils/const';

import { useShortAccountAddress } from '@/hooks/useShortAccountAddress';

export const Header: FC<HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  const router = useRouter();
  const pathname = usePathname();

  const autoConnectionStatus = useAutoConnectWallet();
  const account = useCurrentAccount();
  const { currentWallet, connectionStatus } = useCurrentWallet();
  const shortAccountAddress = useShortAccountAddress();
  const disconnectWallet = useDisconnectWallet();

  const isLoading = useMemo(
    () => autoConnectionStatus === 'idle',
    [autoConnectionStatus]
  );
  const isRedirecting = useMemo(
    () => autoConnectionStatus === 'attempted' && !account?.address,
    [autoConnectionStatus, account?.address]
  );

  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);

  const disconnect = useCallback(
    async () => {
      await disconnectWallet.mutateAsync();

      router.replace(`${PAGES_URLS.signIn}?next=${encodeURIComponent(pathname)}`);
    },
    [disconnectWallet, router, pathname]
  );

  return (
    <div
      className={twMerge(
        'min-h-20 px-8 border-b border-primaryBorder bg-white',
        className
      )}
      {...props}
    >
      <div
        data-testid="header"
        className="flex items-center justify-between max-w-screen-2xl mx-auto h-full"
      >
        <LogoIcon />
        {
          (isLoading || isRedirecting) && (
            <Loader className="h-8" />
          )
        }
        {
          shortAccountAddress && (
            <button
              className="
                border border-primaryBorder rounded-[10px]
                h-10 px-4 flex items-center justify-between gap-2
                text-secondary font-medium
                transition
                hover:bg-actionPrimary hover:bg-opacity-10 hover:border-actionSecondary
              "
              onClick={() => {
                setShowLogoutModal(true);
              }}
            >
              {
                (account?.icon || currentWallet?.icon) && (
                  <NextImage
                    className="rounded-full"
                    src={(account?.icon || currentWallet?.icon) as string}
                    alt="Wallet Icon"
                    width={24}
                    height={24}
                  />
                )
              }
              {shortAccountAddress}
              <LogoutIcon />
            </button>
          )
        }
      </div>
      <LogoutModal
        visible={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        inProcess={connectionStatus === 'disconnected'}
        onProceed={disconnect}
      />
    </div>
  );
};
