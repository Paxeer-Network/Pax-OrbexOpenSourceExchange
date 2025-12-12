


interface settingsAttributes {
  key: string;
  value: string | null;
}

type settingsPk = "key";
type settingsId = settings[settingsPk];
type settingsCreationAttributes = settingsAttributes;
