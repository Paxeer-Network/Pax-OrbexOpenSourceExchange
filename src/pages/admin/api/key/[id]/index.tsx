"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/layouts/Default";
import $fetch from "@/utils/api";
import Card from "@/components/elements/base/card/Card";
import Button from "@/components/elements/base/button/Button";
import Input from "@/components/elements/form/input/Input";
import Checkbox from "@/components/elements/form/checkbox/Checkbox";
import Radio from "@/components/elements/form/radio/Radio";
import { useTranslation } from "next-i18next";
import { toast } from "sonner";
import Select from "@/components/elements/form/select/Select";
import IconButton from "@/components/elements/base/button-icon/IconButton";
import { Icon } from "@iconify/react";

const ApiKeyEdit: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = router.query;

  const [name, setName] = useState<string>("");
  const [permissions, setPermissions] = useState<string[]>([]);
  const [ipWhitelist, setIpWhitelist] = useState<string[]>([]);
  const [ipInput, setIpInput] = useState<string>("");
  const [ipRestriction, setIpRestriction] = useState<string>("restricted");
  const [loading, setLoading] = useState<boolean>(true);
  const [type, setType] = useState<string>("user");

  const permissionOptions = [
    {
      label: t("Trade"),
      value: "trade",
      description: t("Allows placing orders and trading on the exchange."),
    },
    {
      label: t("Futures"),
      value: "futures",
      description: t("Allows trading in futures markets."),
    },
    {
      label: t("Deposit"),
      value: "deposit",
      description: t("Allows viewing deposit addresses and history."),
    },
    {
      label: t("Withdraw"),
      value: "withdraw",
      description: t("Allows withdrawals from the account."),
    },
    {
      label: t("Transfer"),
      value: "transfer",
      description: t("Allows transfers between your accounts."),
    },
    {
      label: t("Payment"),
      value: "payment",
      description: t("Allows creating and confirming payments."),
    },
  ];

  useEffect(() => {
    if (id) fetchApiKey();
  }, [id]);

  const fetchApiKey = async () => {
    setLoading(true);
    const { data, error } = await $fetch({
      url: `/api/admin/api/${id}`,
      silent: true,
    });

    if (!error && data) {
      setName(data.name || "");
      let parsedPermissions = [];
      try {
        parsedPermissions = JSON.parse(data.permissions);
      } catch {
        parsedPermissions = Array.isArray(data.permissions)
          ? data.permissions
          : [];
      }
      setPermissions(parsedPermissions);
      setIpWhitelist(data.ipWhitelist || []);
      setIpRestriction(data.ipRestriction ? "restricted" : "unrestricted");
      setType(data.type || "user");
    } else {
      toast.error(t("Failed to fetch API key data"));
    }

    setLoading(false);
  };

  const handleSubmit = async () => {
    const sanitizedPermissions = permissions.filter(
      (perm) => !["[", "]"].includes(perm) // Remove brackets and any invalid strings
    );

    const body = {
      name,
      permissions: sanitizedPermissions, // Use the sanitized permissions
      ipWhitelist: ipRestriction === "restricted" ? ipWhitelist : [],
      ipRestriction: ipRestriction === "restricted",
      type,
    };

    const { error } = await $fetch({
      url: `/api/admin/api/${id}`,
      method: "PUT",
      body,
    });

    if (!error) {
      toast.success(t("API key updated successfully"));
      router.push("/admin/api/key");
    } else {
      toast.error(t("Failed to update API key"));
    }
  };

  const addIpToWhitelist = () => {
    if (ipInput.trim() && !ipWhitelist.includes(ipInput)) {
      setIpWhitelist([...ipWhitelist, ipInput]);
      setIpInput("");
    } else {
      toast.error(t("IP address is already in the whitelist or invalid."));
    }
  };

  const removeIpFromWhitelist = (ip: string) => {
    setIpWhitelist(ipWhitelist.filter((item) => item !== ip));
  };

  const handlePermissionToggle = (permission: string) => {
    setPermissions((prevPermissions) => {
      if (!Array.isArray(prevPermissions)) prevPermissions = [];
      return prevPermissions.includes(permission)
        ? prevPermissions.filter((p) => p !== permission) // Remove permission
        : [...prevPermissions, permission]; // Add permission
    });
  };

  if (loading) return null;

  return (
    <Layout title={t("Edit API Key")} color="muted">
      <Card className="p-6 mb-5 text-muted-800 dark:text-muted-100">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-lg mb-4 md:mb-0">{t("Edit API Key")}</h1>
          <div className="flex gap-2">
            <Button
              onClick={() => router.push(`/admin/api/key`)}
              variant="outlined"
              shape="rounded-sm"
              size="md"
              color="danger"
            >
              {t("Cancel")}
            </Button>
            <Button
              onClick={handleSubmit}
              variant="outlined"
              shape="rounded-sm"
              size="md"
              color="success"
            >
              {t("Save")}
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <Input
            label={t("API Key Name")}
            placeholder={t("Enter API Key Name")}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Select
            label={t("Type")}
            value={type}
            options={[
              { label: t("User"), value: "user" },
              { label: t("Plugin"), value: "plugin" },
            ]}
            onChange={(e) => setType(e.target.value)}
          />
        </div>
        <div className="mt-6">
          <h4 className="text-lg font-semibold">{t("Permissions")}</h4>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {permissionOptions.map((perm) => (
              <div key={perm.value} className="flex items-center gap-2">
                <Checkbox
                  id={perm.value}
                  checked={permissions.includes(perm.value)}
                  onChange={() => handlePermissionToggle(perm.value)}
                />
                <div>
                  <label
                    htmlFor={perm.value}
                    className="cursor-pointer dark:text-white text-md"
                  >
                    {perm.label}
                  </label>
                  <small className="block text-muted-500 dark:text-muted-400 text-sm">
                    {perm.description}
                  </small>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <h4 className="text-md font-semibold dark:text-muted-100 mb-2">
            {t("IP Access Restrictions")}
          </h4>
          <div className="flex items-center gap-2 mb-4">
            <Radio
              type="radio"
              id="unrestricted"
              name="ipRestriction"
              value="unrestricted"
              label={t("Unrestricted (Less Secure)")}
              checked={ipRestriction === "unrestricted"}
              onChange={() => setIpRestriction("unrestricted")}
            />
            <p className="text-xs text-red-500 dark:text-red-400">
              {t(
                "This API Key allows access from any IP address. This is not recommended."
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Radio
              type="radio"
              id="restricted"
              name="ipRestriction"
              value="restricted"
              label={t("Restrict access to trusted IPs only (Recommended)")}
              checked={ipRestriction === "restricted"}
              onChange={() => setIpRestriction("restricted")}
            />
          </div>
          {ipRestriction === "restricted" && (
            <>
              <Input
                placeholder={t("Enter IP to Whitelist")}
                value={ipInput}
                onChange={(e) => setIpInput(e.target.value)}
                className="dark:bg-muted-800 dark:text-white mt-2"
                onKeyPress={(e) => {
                  if (e.key === "Enter") addIpToWhitelist();
                }}
              />
              <Button
                onClick={addIpToWhitelist}
                className="mt-2"
                disabled={!ipInput.trim()}
              >
                {t("Add IP")}
              </Button>
              <div className="mt-2">
                {Array.isArray(ipWhitelist) &&
                  ipWhitelist.map((ip, index) => (
                    <div key={index} className="flex items-center gap-2 mt-1">
                      <span className="dark:text-white">{ip}</span>
                      <IconButton
                        size="sm"
                        onClick={() => removeIpFromWhitelist(ip)}
                      >
                        <Icon
                          icon="mdi:close"
                          className="h-4 w-4 dark:text-white"
                        />
                      </IconButton>
                    </div>
                  ))}
              </div>
            </>
          )}
        </div>
      </Card>
    </Layout>
  );
};

export default ApiKeyEdit;
