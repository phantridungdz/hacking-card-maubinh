import React, { useEffect, useRef, useState } from 'react';
import { getCaptcha, loginSunWin } from 'service/login';
import useAccountStore from 'store/accountStore';
import { useToast } from '../toast/use-toast';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '../ui/dialog';
import { Input } from '../ui/input';

const CaptCha: React.FC<any> = ({
  isDialogCaptchaOpen,
  setDialogCaptchaOpen,
  rowSelected,
  accountType,
}) => {
  const { toast } = useToast();
  const [errorMessage, setErrorMessage] = useState('');
  const [imageBase64, setImageBase64] = useState('');
  const [session, setSession] = useState('');
  const [aswer, setAnswer] = useState('');
  const codeRef = useRef<HTMLInputElement>(null);
  const { updateAccount } = useAccountStore();
  const onGetCaptcha = async () => {
    const { data } = await getCaptcha('', 'https://api.azhkthg1.net/id');
    console.log('data', data);
    setImageBase64(data.image);
    setSession(data.sessionId);
  };

  const onLogin = async () => {
    console.log('sessiononlogin', session);
    const { data } = await loginSunWin(
      rowSelected,
      accountType,
      updateAccount,
      'https://api.azhkthg1.net/id',
      aswer,
      session
    );
    setDialogCaptchaOpen(false);
  };

  useEffect(() => {
    if (isDialogCaptchaOpen) {
      onGetCaptcha();
      console.log('rowSelected', rowSelected);
    }
  }, [isDialogCaptchaOpen]);

  return (
    <Dialog open={isDialogCaptchaOpen} onOpenChange={setDialogCaptchaOpen}>
      <DialogContent>
        <DialogTitle>{`Captcha: ${rowSelected?.username}`}</DialogTitle>
        <DialogDescription className={`${errorMessage && 'text-red-400'}`}>
          {errorMessage ? errorMessage : 'Nhập captcha để đăng nhập !'}
        </DialogDescription>
        <div className="grid grid-cols-4 gap-2">
          <img src={`data:image/jpeg;base64,${imageBase64}`} />

          <Input
            ref={codeRef}
            placeholder="Mã thẻ"
            className="col-span-3"
            onChange={(e) => setAnswer(e.target.value)}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            variant="secondary"
            onClick={() => setDialogCaptchaOpen(false)}
          >
            Cancel
          </Button>
          <Button onClick={() => onLogin()}>Đăng nhập</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CaptCha;
