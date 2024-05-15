import React, { useRef, useState } from 'react';
import useAccountStore from '../../store/accountStore';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

const AddProxy: React.FC<any> = ({
  isDialogProxyOpen,
  setDialogProxyOpen,
  rowSelected,
  accountType,
}) => {
  const { updateAccount } = useAccountStore();
  const [errorAddProxy, setErrorAddProxy] = useState<any>();
  const [useAuthForProxy, setUseAuthForProxy] = useState(false);
  const proxyRef = useRef<HTMLInputElement>(null);
  const portRef = useRef<HTMLInputElement>(null);
  const authUsernameRef = useRef<HTMLInputElement>(null);
  const authPasswordRef = useRef<HTMLInputElement>(null);
  const handleAddProxy = (row: any) => {
    if (!proxyRef.current?.value) {
      setErrorAddProxy('Please input proxy');
      return;
    }
    if (!portRef.current?.value) {
      setErrorAddProxy('Please input port');
      return;
    }

    if (proxyRef.current && portRef.current && row) {
      const newProxy = {
        proxy: proxyRef.current.value,
        port: portRef.current.value,
        userProxy: useAuthForProxy ? authUsernameRef.current?.value : '',
        passProxy: useAuthForProxy ? authPasswordRef.current?.value : '',
      };
      updateAccount(accountType, row.username, newProxy);
      setDialogProxyOpen(false);
    }
  };
  return (
    <Dialog open={isDialogProxyOpen} onOpenChange={setDialogProxyOpen}>
      <DialogContent>
        <DialogTitle>Add proxy</DialogTitle>
        <DialogDescription className={`${errorAddProxy && 'text-red-500'}`}>
          {errorAddProxy
            ? errorAddProxy
            : 'Enter the details of the new proxy.'}
        </DialogDescription>
        <Input ref={proxyRef} placeholder="Proxy" className="mb-4" />
        <Input
          ref={portRef}
          type="password"
          placeholder="Port"
          className="mb-4"
        />
        <div className="flex flex-row items-center justify-start gap-2">
          <Checkbox
            className="bg-white"
            checked={useAuthForProxy}
            onCheckedChange={() => setUseAuthForProxy(!useAuthForProxy)}
          />
          <Label>Is use authentication ?</Label>
        </div>

        {useAuthForProxy && (
          <>
            <Input
              ref={authUsernameRef}
              placeholder="Username for Proxy"
              className="mb-4"
            />
            <Input
              ref={authPasswordRef}
              type="password"
              placeholder="Password for Proxy"
              className="mb-4"
            />
          </>
        )}
        <div className="flex justify-end space-x-2">
          <Button variant="secondary" onClick={() => setDialogProxyOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => handleAddProxy(rowSelected)}>Set proxy</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddProxy;
