import React, { useState } from 'react';
import {
  ShieldCheck,
  DollarSign,
  Building,
  MessageSquare,
  RotateCcw,
  Save,
  CheckCircle2,
  Database,
  Info,
} from 'lucide-react';
import { GymSettings } from '../types/gym';
import {
  getGymSettings,
  saveGymSettings,
  DEFAULT_SETTINGS,
  mergeSeedData,
  resetDatabaseToSeed,
} from '../services/storage';

interface SettingsProps {
  onSettingsSaved?: (newSettings: GymSettings) => void;
  onNavigate?: (tab: 'dashboard' | 'members') => void;
  onToast?: (type: 'success' | 'error' | 'info', title: string, msg?: string) => void;
}

export const Settings: React.FC<SettingsProps> = ({
  onSettingsSaved,
  onToast,
}) => {
  const [settings, setSettings] = useState<GymSettings>(() => getGymSettings());
  const [isSaved, setIsSaved] = useState(false);
  const [isMerging, setIsMerging] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate 4-digit PIN
    if (!/^\d{4}$/.test(settings.securityPin)) {
      onToast?.('error', 'Invalid PIN', 'Security PIN must be exactly 4 digits (e.g. 1234).');
      return;
    }

    // Validate fees
    if (settings.monthlyFee <= 0) {
      onToast?.('error', 'Invalid Fee', 'Monthly fee must be greater than zero.');
      return;
    }

    saveGymSettings(settings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
    onSettingsSaved?.(settings);
    onToast?.('success', 'Settings Saved', 'Gym configuration & PIN updated successfully.');
  };

  const handleResetTemplates = () => {
    if (window.confirm('Reset WhatsApp message templates back to system defaults?')) {
      setSettings((prev) => ({
        ...prev,
        reminderTemplate: DEFAULT_SETTINGS.reminderTemplate,
        welcomeTemplate: DEFAULT_SETTINGS.welcomeTemplate,
      }));
      onToast?.('info', 'Templates Reset', 'Message templates restored to defaults.');
    }
  };

  const handleMergeDemoData = async () => {
    try {
      setIsMerging(true);
      const count = await mergeSeedData();
      onToast?.(
        'success',
        'Data Merged',
        count > 0
          ? `Merged ${count} sample members into database. Existing members kept safe!`
          : 'Sample data is already present in your database.'
      );
    } catch {
      onToast?.('error', 'Merge Failed', 'Could not merge sample data.');
    } finally {
      setIsMerging(false);
    }
  };

  const handleFactoryReset = async () => {
    if (
      window.confirm(
        'WARNING: Factory reset will clear all records and load fresh demo data. Do you want to proceed?'
      )
    ) {
      try {
        setIsResetting(true);
        await resetDatabaseToSeed(false);
        onToast?.('info', 'Factory Reset Complete', 'Database restored to fresh demo state.');
      } catch {
        onToast?.('error', 'Reset Error', 'Could not complete factory reset.');
      } finally {
        setIsResetting(false);
      }
    }
  };

  return (
    <div className="space-y-5 pb-28 px-4 pt-2 max-w-md mx-auto select-none">
      {/* Page Title */}
      <div className="space-y-1">
        <span className="text-[10px] font-bold text-[#1A3EEA] uppercase tracking-widest">
          ADMIN PREFERENCES
        </span>
        <h2 className="text-xl font-black text-[#0F172A] tracking-tight">System Settings</h2>
        <p className="text-xs text-[#64748B]">
          Configure fees, security PIN, branding, and WhatsApp templates
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {/* Section 1: Security PIN */}
        <div className="p-4 bg-white border border-[#E9ECEF] rounded-[24px] shadow-apple-card space-y-3">
          <div className="flex items-center space-x-2.5 text-xs font-bold text-[#0F172A]">
            <div className="w-8 h-8 rounded-xl bg-[#EBF1FF] text-[#1A3EEA] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="block uppercase tracking-wider text-[11px] text-[#64748B]">Security</span>
              <h3 className="text-sm font-bold text-[#0F172A]">4-Digit Entrance PIN</h3>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#64748B] mb-1.5">
              Owner Access PIN (4 digits)
            </label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={settings.securityPin}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                setSettings((prev) => ({ ...prev, securityPin: val }));
              }}
              className="w-full h-12 bg-[#F8FAFC] border border-[#E9ECEF] rounded-2xl px-4 text-center font-mono font-black text-xl tracking-[0.4em] text-[#0F172A] focus:outline-none focus:border-[#1A3EEA] focus:bg-white transition-all shadow-sm"
              placeholder="1234"
              required
            />
            <p className="text-[11px] text-[#94A3B8] mt-1 text-center">
              Default is 1234. Required to unlock the management system.
            </p>
          </div>
        </div>

        {/* Section 2: Financial Rates */}
        <div className="p-4 bg-white border border-[#E9ECEF] rounded-[24px] shadow-apple-card space-y-3">
          <div className="flex items-center space-x-2.5 text-xs font-bold text-[#0F172A]">
            <div className="w-8 h-8 rounded-xl bg-[#EBF1FF] text-[#1A3EEA] flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <span className="block uppercase tracking-wider text-[11px] text-[#64748B]">Pricing</span>
              <h3 className="text-sm font-bold text-[#0F172A]">Membership Fee Structure</h3>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#64748B] mb-1.5">
                Monthly Fee (PKR)
              </label>
              <input
                type="number"
                min={500}
                step={100}
                value={settings.monthlyFee}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    monthlyFee: Math.max(0, parseInt(e.target.value, 10) || 0),
                  }))
                }
                className="w-full h-11 bg-[#F8FAFC] border border-[#E9ECEF] rounded-2xl px-3.5 text-sm font-bold text-[#0F172A] focus:outline-none focus:border-[#1A3EEA] focus:bg-white transition-all shadow-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#64748B] mb-1.5">
                Default Admission (PKR)
              </label>
              <input
                type="number"
                min={0}
                step={100}
                value={settings.defaultAdmissionFee}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    defaultAdmissionFee: Math.max(0, parseInt(e.target.value, 10) || 0),
                  }))
                }
                className="w-full h-11 bg-[#F8FAFC] border border-[#E9ECEF] rounded-2xl px-3.5 text-sm font-bold text-[#0F172A] focus:outline-none focus:border-[#1A3EEA] focus:bg-white transition-all shadow-sm"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 3: Gym & Owner Names */}
        <div className="p-4 bg-white border border-[#E9ECEF] rounded-[24px] shadow-apple-card space-y-3">
          <div className="flex items-center space-x-2.5 text-xs font-bold text-[#0F172A]">
            <div className="w-8 h-8 rounded-xl bg-[#EBF1FF] text-[#1A3EEA] flex items-center justify-center">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <span className="block uppercase tracking-wider text-[11px] text-[#64748B]">Identity</span>
              <h3 className="text-sm font-bold text-[#0F172A]">Branding & Owner Name</h3>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[#64748B] mb-1.5">Gym Name</label>
              <input
                type="text"
                value={settings.gymName}
                onChange={(e) => setSettings((prev) => ({ ...prev, gymName: e.target.value }))}
                className="w-full h-11 bg-[#F8FAFC] border border-[#E9ECEF] rounded-2xl px-3.5 text-sm font-bold text-[#0F172A] focus:outline-none focus:border-[#1A3EEA] focus:bg-white transition-all shadow-sm"
                placeholder="MONSTER'S GYM"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#64748B] mb-1.5">Owner / Founder Name</label>
              <input
                type="text"
                value={settings.ownerName}
                onChange={(e) => setSettings((prev) => ({ ...prev, ownerName: e.target.value }))}
                className="w-full h-11 bg-[#F8FAFC] border border-[#E9ECEF] rounded-2xl px-3.5 text-sm font-bold text-[#0F172A] focus:outline-none focus:border-[#1A3EEA] focus:bg-white transition-all shadow-sm"
                placeholder="DASTGIR KANTH"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 4: WhatsApp Templates */}
        <div className="p-4 bg-white border border-[#E9ECEF] rounded-[24px] shadow-apple-card space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5 text-xs font-bold text-[#0F172A]">
              <div className="w-8 h-8 rounded-xl bg-[#EBF1FF] text-[#1A3EEA] flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <span className="block uppercase tracking-wider text-[11px] text-[#64748B]">WhatsApp</span>
                <h3 className="text-sm font-bold text-[#0F172A]">Message Templates</h3>
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetTemplates}
              className="text-[11px] font-bold text-[#1A3EEA] hover:underline flex items-center space-x-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E9ECEF] text-[11px] text-[#64748B] flex items-start space-x-2">
            <Info className="w-4 h-4 text-[#1A3EEA] shrink-0 mt-0.5" />
            <span>
              Tags supported: <code className="font-mono text-[#0F172A]">{'{name}'}</code>,{' '}
              <code className="font-mono text-[#0F172A]">{'{expiry}'}</code>,{' '}
              <code className="font-mono text-[#0F172A]">{'{fee}'}</code>,{' '}
              <code className="font-mono text-[#0F172A]">{'{gymName}'}</code>,{' '}
              <code className="font-mono text-[#0F172A]">{'{ownerName}'}</code>
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[#64748B] mb-1.5">
                Expiry Reminder Template
              </label>
              <textarea
                rows={6}
                value={settings.reminderTemplate}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, reminderTemplate: e.target.value }))
                }
                className="w-full bg-[#F8FAFC] border border-[#E9ECEF] rounded-2xl p-3 text-xs font-sans text-[#0F172A] focus:outline-none focus:border-[#1A3EEA] focus:bg-white transition-all shadow-sm leading-relaxed"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#64748B] mb-1.5">
                Welcome New Member Template
              </label>
              <textarea
                rows={6}
                value={settings.welcomeTemplate}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, welcomeTemplate: e.target.value }))
                }
                className="w-full bg-[#F8FAFC] border border-[#E9ECEF] rounded-2xl p-3 text-xs font-sans text-[#0F172A] focus:outline-none focus:border-[#1A3EEA] focus:bg-white transition-all shadow-sm leading-relaxed"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 5: Data Operations */}
        <div className="p-4 bg-white border border-[#E9ECEF] rounded-[24px] shadow-apple-card space-y-3">
          <div className="flex items-center space-x-2.5 text-xs font-bold text-[#0F172A]">
            <div className="w-8 h-8 rounded-xl bg-[#EBF1FF] text-[#1A3EEA] flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <span className="block uppercase tracking-wider text-[11px] text-[#64748B]">Database</span>
              <h3 className="text-sm font-bold text-[#0F172A]">Data & Demo Controls</h3>
            </div>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={handleMergeDemoData}
              disabled={isMerging}
              className="w-full py-2.5 px-3 rounded-2xl bg-[#EBF1FF] text-[#1A3EEA] hover:bg-[#DCE6FD] transition-colors text-xs font-bold flex items-center justify-between cursor-pointer"
            >
              <span>{isMerging ? 'Merging data...' : 'Merge Sample Demo Data'}</span>
              <span className="text-[11px] font-semibold text-[#64748B]">Safe • Keeps Custom Data</span>
            </button>

            <button
              type="button"
              onClick={handleFactoryReset}
              disabled={isResetting}
              className="w-full py-2.5 px-3 rounded-2xl bg-[#FEF2F2] text-red-600 hover:bg-red-100 transition-colors text-xs font-bold flex items-center justify-between cursor-pointer"
            >
              <span>{isResetting ? 'Resetting...' : 'Factory Reset (Fresh Demo)'}</span>
              <span className="text-[11px] font-semibold text-red-400">Clears All Records</span>
            </button>
          </div>
        </div>

        {/* Floating / Sticky Save Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full h-12 rounded-2xl bg-[#1A3EEA] hover:bg-[#1534D8] active:scale-[0.98] transition-all text-white font-bold text-sm tracking-wider flex items-center justify-center space-x-2 shadow-glow-blue cursor-pointer"
          >
            {isSaved ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>SAVED SUCCESSFULLY</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>SAVE SETTINGS</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
