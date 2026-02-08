import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Button, Header, DentalHeader, Icons, useModal } from '@ohif/ui-next';
import { useSystem, useTheme } from '@ohif/core';
import { Toolbar } from '../Toolbar/Toolbar';
import HeaderPatientInfo from './HeaderPatientInfo';
import { PatientInfoVisibility } from './HeaderPatientInfo/HeaderPatientInfo';
import { preserveQueryParameters } from '@ohif/app';
import { Types } from '@ohif/core';

function ViewerHeader({ appConfig }: withAppTypes<{ appConfig: AppTypes.Config }>) {
  const { theme, setTheme } = useTheme();
  const { servicesManager, extensionManager, commandsManager } = useSystem();
  const { customizationService, hangingProtocolService } = servicesManager.services;

  const switchToDental = () => {
    setTheme('DENTAL');
    hangingProtocolService.setProtocol('@ohif/hpDental');
  };

  const switchToRadiology = () => {
    setTheme('RADIOLOGY');
    hangingProtocolService.setProtocol('default');
  };

  const navigate = useNavigate();
  const location = useLocation();

  const onClickReturnButton = () => {
    const { pathname } = location;
    const dataSourceIdx = pathname.indexOf('/', 1);

    const dataSourceName = pathname.substring(dataSourceIdx + 1);
    const existingDataSource = extensionManager.getDataSources(dataSourceName);

    const searchQuery = new URLSearchParams();
    if (dataSourceIdx !== -1 && existingDataSource) {
      searchQuery.append('datasources', pathname.substring(dataSourceIdx + 1));
    }
    preserveQueryParameters(searchQuery);

    navigate({
      pathname: '/',
      search: decodeURIComponent(searchQuery.toString()),
    });
  };

  const { t } = useTranslation();
  const { show } = useModal();

  const AboutModal = customizationService.getCustomization(
    'ohif.aboutModal'
  ) as Types.MenuComponentCustomization;

  const UserPreferencesModal = customizationService.getCustomization(
    'ohif.userPreferencesModal'
  ) as Types.MenuComponentCustomization;

  const menuOptions = [
    {
      title: AboutModal?.menuTitle ?? t('Header:About'),
      icon: 'info',
      onClick: () =>
        show({
          content: AboutModal,
          title: AboutModal?.title ?? t('AboutModal:About OHIF Viewer'),
          containerClassName: AboutModal?.containerClassName ?? 'max-w-md',
        }),
    },
    {
      title: UserPreferencesModal.menuTitle ?? t('Header:Preferences'),
      icon: 'settings',
      onClick: () =>
        show({
          content: UserPreferencesModal,
          title: UserPreferencesModal.title ?? t('UserPreferencesModal:User preferences'),
          containerClassName:
            UserPreferencesModal?.containerClassName ?? 'flex max-w-4xl p-6 flex-col',
        }),
    },
  ];

  if (appConfig.oidc) {
    menuOptions.push({
      title: t('Header:Logout'),
      icon: 'power-off',
      onClick: async () => {
        navigate(`/logout?redirect_uri=${encodeURIComponent(window.location.href)}`);
      },
    });
  }

  return (
    <>
      <Header
        theme={theme}
        onToggleDentalMode={switchToDental}
        menuOptions={menuOptions}
        isReturnEnabled={!!appConfig.showStudyList}
        onClickReturnButton={onClickReturnButton}
        WhiteLabeling={appConfig.whiteLabeling}
        Secondary={<Toolbar buttonSection="secondary" />}
        PatientInfo={
          appConfig.showPatientInfo !== PatientInfoVisibility.DISABLED && (
            <HeaderPatientInfo
              servicesManager={servicesManager}
              appConfig={appConfig}
            />
          )
        }
        UndoRedo={
          <div className="text-primary flex cursor-pointer items-center">
            <Button
              variant="ghost"
              className="hover:bg-primary-dark"
              onClick={() => {
                commandsManager.run('undo');
              }}
            >
              <Icons.Undo className="" />
            </Button>
            <Button
              variant="ghost"
              className="hover:bg-primary-dark"
              onClick={() => {
                commandsManager.run('redo');
              }}
            >
              <Icons.Redo className="" />
            </Button>
          </div>
        }
      >
        <div className="relative flex justify-center gap-[4px]">
          <Toolbar buttonSection="primary" />
        </div>
      </Header>
      <DentalHeader
        theme={theme}
        onToggleRadiologyTheme={switchToRadiology}
        menuOptions={menuOptions}
        isReturnEnabled={!!appConfig.showStudyList}
        onClickReturnButton={onClickReturnButton}
        WhiteLabeling={appConfig.whiteLabeling}
        practiceName={appConfig.dentalPracticeName || 'Dental Practice'}
        PatientInfo={
          appConfig.showPatientInfo !== PatientInfoVisibility.DISABLED && (
            <HeaderPatientInfo
              servicesManager={servicesManager}
              appConfig={appConfig}
            />
          )
        }
        UndoRedo={
          <div className="text-primary flex cursor-pointer items-center">
            <Button
              variant="ghost"
              className="hover:bg-primary-dark"
              onClick={() => {
                commandsManager.run('undo');
              }}
            >
              <Icons.Undo className="" />
            </Button>
            <Button
              variant="ghost"
              className="hover:bg-primary-dark"
              onClick={() => {
                commandsManager.run('redo');
              }}
            >
              <Icons.Redo className="" />
            </Button>
          </div>
        }
      >
        <div className="relative flex justify-center gap-[4px]">
          <Toolbar buttonSection="primary" />
        </div>
      </DentalHeader>
    </>
  );
}

export default ViewerHeader;
