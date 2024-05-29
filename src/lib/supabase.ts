import { createClient } from '@supabase/supabase-js';
import { format } from 'date-fns';
import _ from 'lodash';
import { fetchHardwareInfo } from './hardwareInfo';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl as any, supabaseKey as any);

export const handleActive = async (
  key: string,
  setLoading: (loading: boolean) => void,
  toast: (options: { title: string; description: string }) => void,
  navigate: (path: string) => void
): Promise<void> => {
  if (!key) {
    toast({ title: 'Error', description: 'Please type a key to active.' });
    return;
  }
  setLoading(true);
  const hardwareInfo = await fetchHardwareInfo();

  try {
    if (!hardwareInfo) {
      toast({ title: 'Error', description: 'Error while active license key.' });
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('license-key')
      .select('*')
      .eq('license_key', key)
      .single();

    if (error) throw new Error('Error while active license key.');
    if (data.length === 1) {
      if (
        !data[0].uuid &&
        !data[0].pc_name &&
        !data[0].cpu &&
        !data[0].system &&
        !data[0].active_at
      ) {
        const { error: updateError } = await supabase
          .from('license-key')
          .update({
            uuid: hardwareInfo.system.uuid,
            pc_name: hardwareInfo.hostname,
            cpu: hardwareInfo.cpu,
            system: hardwareInfo.system,
            active_at: new Date(),
          })
          .eq('license_key', key);

        if (updateError) throw new Error('Could not activate key');

        localStorage.setItem('license-key', key);
        toast({
          title: 'Success',
          description: 'Key has been activated.',
        });
        navigate('/app');
      } else {
        if (
          _.isEqual(data[0].uuid, hardwareInfo.system.uuid) &&
          _.isEqual(data[0].pc_name, hardwareInfo.hostname) &&
          _.isEqual(data[0].cpu, hardwareInfo.cpu) &&
          _.isEqual(data[0].system, hardwareInfo.system)
        ) {
          localStorage.setItem('license-key', key);
          navigate('/app');
        } else {
          toast({
            title: 'Error',
            description: 'Error while active license key.',
          });
        }
      }
    } else {
      toast({ title: 'Error', description: 'Key not found.' });
    }
  } catch (error) {
    toast({
      title: 'Error',
      description: 'An error occurred during activation.',
    });
    navigate('/');
  } finally {
    setLoading(false);

    console.log(hardwareInfo);
    return hardwareInfo;
  }
};

export const validateLicense = async (
  setLoading: (loading: boolean) => void,
  toast: (options: { title: string; description: string }) => void,
  navigate: (path: string) => void
): Promise<void> => {
  setLoading(true);
  const licenseKey = localStorage.getItem('license-key');
  const hardwareInfo = await fetchHardwareInfo();
  if (!licenseKey) {
    toast({ title: 'Error', description: 'No license key found.' });
    navigate('/');
    setLoading(false);
    return hardwareInfo;
  }

  if (!hardwareInfo) {
    toast({ title: 'Error', description: 'Failed to fetch hardware info.' });
    setLoading(false);
    return;
  }

  try {
    const { data, error } = await supabase
      .from('license-key')
      .select('*')
      .eq('license_key', licenseKey)
      .single();

    if (error || !data) {
      toast({
        title: 'Error',
        description: 'An error occurred during validation.',
      });
      setLoading(false);
      return hardwareInfo;
    }
    console.log('hardwareInfo', hardwareInfo);
    console.log('data[0]', data[0]);

    if (
      _.isEqual(data[0].uuid, hardwareInfo.system.uuid) &&
      _.isEqual(data[0].pc_name, hardwareInfo.hostname) &&
      _.isEqual(data[0].cpu, hardwareInfo.cpu) &&
      _.isEqual(data[0].system, hardwareInfo.system)
    ) {
      navigate('/app');
    } else {
      toast({
        title: 'Error',
        description: 'An error occurred during validation.',
      });
    }
  } catch (error) {
    console.log('error', error);
    localStorage.removeItem('license-key');
    toast({
      title: 'Error',
      description: 'An error occurred during validation.',
    });
  } finally {
    setLoading(false);
    console.log(hardwareInfo);
    return hardwareInfo;
  }
};

export const addMoney = async (key: string, money: number, navigate: any) => {
  try {
    const today = format(new Date(), 'yyyy-MM-dd');
    console.log('today', today);
    const { data: licenseData, error: licenseError } = (await supabase
      .from('license-key')
      .select('money_earn')
      .eq('license_key', key)
      .single()) as any;
    if (licenseError) {
      navigate('/');
    }

    if (licenseError) throw licenseError;
    console.log('licenseData', licenseData);
    const updatedMoney = licenseData[0].money_earn
      ? licenseData[0].money_earn + money
      : money;

    const { error: updateError } = await supabase
      .from('license-key')
      .update({ money_earn: updatedMoney })
      .eq('license_key', key);

    if (updateError) throw updateError;

    const { data: dailyData, error: dailyError } = await supabase
      .from('money-day-by-day')
      .select('*')
      .eq('license_key', key)
      .eq('date', today)
      .single();

    console.log('dailyData', dailyData);

    if (dailyData.length === 1) {
      const { error: updateDailyError } = await supabase
        .from('money-day-by-day')
        .update({ money_earn: dailyData[0].money_earn + money })
        .eq('license_key', dailyData[0].license_key);

      if (updateDailyError) throw updateDailyError;
    } else {
      const { error: createDailyError } = await supabase
        .from('money-day-by-day')
        .insert([
          {
            license_key: key,
            money_earn: money,
            date: today,
            created_at: new Date(),
          },
        ]);

      if (createDailyError) throw createDailyError;
    }

    return { message: 'Money added successfully to both tables.' };
  } catch (error) {
    console.error('Error updating money:', error);
    return null;
  }
};
