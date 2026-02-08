import React from 'react';
import classNames from 'classnames';
import { Button, Icons } from '..';

/** Dental Theme Toggle Button */
function DentalThemeToggleButton({
  isDentalTheme,
  onToggle,
}: {
  isDentalTheme: boolean;
  onToggle: () => void;
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={classNames(
        'flex items-center gap-1.5 px-2 py-1 transition-colors',
        isDentalTheme
          ? 'text-primary bg-primary/10'
          : 'text-muted-foreground hover:bg-primary-dark hover:text-primary'
      )}
      onClick={onToggle}
      title={isDentalTheme ? 'Switch to Standard Theme' : 'Switch to Dental Theme'}
    >
      <Icons.DentalThemeToggle className="h-5 w-5" />
      <span className="text-xs font-medium">{isDentalTheme ? 'Dental' : 'Standard'}</span>
    </Button>
  );
}

export default DentalThemeToggleButton;
