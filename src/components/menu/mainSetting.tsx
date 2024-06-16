import { LoaderIcon, SaveIcon, X } from 'lucide-react';
import React from 'react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';

const MainSetting: React.FC<any> = ({ children, setIsOpen, isOpen }) => {
  const handleBackup = () => {
    window.backend.sendMessage('backup-data');
  };

  const handleRestore = () => {
    window.backend.sendMessage('restore-data');
  };
  return (
    <div
      className={`fixed top-0 w-screen h-screen bg-black bg-opacity-60 z-[101] flex flex-row ${
        !isOpen && 'hidden'
      }`}
    >
      <div
        className="flex flex-grow cursor-pointer"
        onClick={() => setIsOpen(false)}
      ></div>
      <div className="h-full bg-background p-4 w-full max-w-[800px]">
        <div className="flex justify-between items-center top-4 w-full">
          <h1 className="text-xl font-semibold">Settings</h1>
          <Button
            onClick={() => setIsOpen(false)}
            className="hover:bg-transparent cursor-pointer"
            variant="ghost"
          >
            <X />
          </Button>
        </div>
        <ScrollArea className="h-screen pr-4 relative">
          <div className="sticky top-0 flex justify-end  gap-2 z-[100] bg-background">
            <Button
              onClick={handleBackup}
              size="sm"
              className="h-8 gap-1 cursor-pointer hover:opacity-70"
            >
              <SaveIcon className="h-3.5 w-3.5" />
              Backup
            </Button>
            <Button
              onClick={handleRestore}
              size="sm"
              className="h-8 gap-1 cursor-pointer hover:opacity-70"
            >
              <LoaderIcon className="h-3.5 w-3.5" />
              Restore
            </Button>
          </div>
          <div className="mt-4 flex flex-col gap-4 mb-[200px]">{children}</div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default MainSetting;
