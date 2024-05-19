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

  const handleProxyInputChange = (event: any) => {
    if (
      !proxyRef.current?.value ||
      !portRef.current?.value ||
      !authUsernameRef.current?.value ||
      !authPasswordRef.current?.value
    ) {
      setErrorAddProxy('Please input proxy and port');
      return;
    }
    const proxyString = event.target.value;
    const parts = proxyString.split(':');
    if (parts.length === 4) {
      proxyRef.current.value = parts[0];
      portRef.current.value = parts[1];
      authUsernameRef.current.value = parts[2];
      authPasswordRef.current.value = parts[3];
      setUseAuthForProxy(true);
    }
  };

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
        proxy: proxyRef.current.value.trim(),
        port: portRef.current.value.trim(),
        userProxy: useAuthForProxy ? authUsernameRef.current?.value.trim() : '',
        passProxy: useAuthForProxy ? authPasswordRef.current?.value.trim() : '',
        isUseProxy: true,
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
        <Input
          ref={proxyRef}
          placeholder="Proxy"
          className="mb-4"
          defaultValue={rowSelected?.proxy}
          onChange={handleProxyInputChange}
        />
        <Input
          ref={portRef}
          placeholder="Port"
          className="mb-4"
          defaultValue={rowSelected?.port}
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
              defaultValue={rowSelected?.userProxy}
            />
            <Input
              ref={authPasswordRef}
              placeholder="Password for Proxy"
              className="mb-4"
              defaultValue={rowSelected?.passProxy}
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
