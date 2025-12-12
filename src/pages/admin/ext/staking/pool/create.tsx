import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/layouts/Default";
import $fetch from "@/utils/api";
import Card from "@/components/elements/base/card/Card";
import Button from "@/components/elements/base/button/Button";
import Input from "@/components/elements/form/input/Input";
import ListBox from "@/components/elements/form/listbox/Listbox";
import Textarea from "@/components/elements/form/textarea/Textarea";
import InputFile from "@/components/elements/form/input-file/InputFile"; // Import the InputFile component
import { useTranslation } from "next-i18next";
import { imageUploader } from "@/utils/upload"; // Import the imageUploader utility

interface Option {
  value: string;
  label: string;
}

const StakingPoolCreate: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<{
    currencies: {
      FIAT: Option[];
      SPOT: Option[];
      ECO: Option[];
    };
    chains: { [key: string]: string[] };
  } | null>(null);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [type, setType] = useState<Option | null>(null);
  const [currency, setCurrency] = useState<Option | null>(null);
  const [chain, setChain] = useState<Option | null>(null);
  const [minStake, setMinStake] = useState<string>("");
  const [maxStake, setMaxStake] = useState<string>("");
  const [status, setStatus] = useState<Option | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null); // State to hold the uploaded image URL
  const router = useRouter();

  useEffect(() => {
    fetchFormData();
  }, []);

  const fetchFormData = async () => {
    const { data, error } = await $fetch({
      url: "/api/admin/ext/staking/pool/data",
      silent: true,
    });
    if (!error && data) {
      setFormData(data);
    }
  };

  const handleSubmit = async () => {
    const body = {
      name,
      description,
      type: type?.value,
      currency: currency?.value,
      chain: chain?.value,
      minStake: parseFloat(minStake),
      maxStake: parseFloat(maxStake),
      status: status?.value,
      icon: imageUrl || "", // Include the image URL in the body
    };

    const { error } = await $fetch({
      url: `/api/admin/ext/staking/pool`,
      method: "POST",
      body,
    });

    if (!error) {
      router.push(`/admin/ext/staking/pool`);
    }
  };

  const handleFileUpload = async (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      const result = await imageUploader({
        file,
        dir: `staking/pools`, // You can change the directory path based on your requirements
        size: {
          maxWidth: 720,
          maxHeight: 720,
        },
      });

      if (result.success) {
        setImageUrl(result.url);
      } else {
        console.error("Error uploading file");
      }
    }
  };

  const getCurrencyOptions = () => {
    if (!type || !formData) return [];
    return formData.currencies[type.value] || [];
  };

  const getChainOptions = () => {
    if (!currency || !formData || !formData.chains) return [];
    return (
      formData.chains[currency.value]?.map((chain) => ({
        value: chain,
        label: chain,
      })) || []
    );
  };

  if (!formData) return null;

  return (
    <Layout title={t("Create Staking Pool")} color="muted">
      <Card className="p-5 mb-5 text-muted-800 dark:text-muted-100">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-lg mb-4 md:mb-0">{t("New Staking Pool")}</h1>
          <div className="flex gap-2">
            <Button
              onClick={() => router.push(`/admin/ext/staking/pool`)}
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

        <div className="my-5">
          <InputFile
            id="pool-image"
            acceptedFileTypes={[
              "image/png",
              "image/jpeg",
              "image/jpg",
              "image/gif",
              "image/svg+xml",
              "image/webp",
            ]}
            preview={imageUrl}
            previewPlaceholder="/img/placeholder.svg"
            maxFileSize={16}
            label={`${t("Max File Size")}: 16 MB`}
            labelAlt={`${t("Size")}: 720x720 px`}
            bordered
            color="default"
            onChange={handleFileUpload}
            onRemoveFile={() => setImageUrl(null)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <Input
            label={t("Name")}
            placeholder={t("Enter the pool name")}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <ListBox
            label={t("Wallet Type")}
            options={[
              { value: "FIAT", label: t("Fiat") },
              { value: "SPOT", label: t("Spot") },
              { value: "ECO", label: t("Funding") },
            ]}
            selected={type}
            setSelected={setType}
          />
          <ListBox
            label={t("Currency")}
            options={getCurrencyOptions()}
            selected={currency}
            setSelected={(selectedOption) => setCurrency(selectedOption)}
          />
          {type?.value === "ECO" && (
            <ListBox
              label={t("Chain")}
              options={getChainOptions()}
              selected={chain}
              setSelected={setChain}
            />
          )}
          <Input
            label={t("Minimum Stake")}
            placeholder={t("Enter the minimum staking amount")}
            value={minStake}
            onChange={(e) => setMinStake(e.target.value)}
          />
          <Input
            label={t("Maximum Stake")}
            placeholder={t("Enter the maximum staking amount")}
            value={maxStake}
            onChange={(e) => setMaxStake(e.target.value)}
          />
          <Textarea
            label={t("Description")}
            placeholder={t("Enter the pool description")}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <ListBox
            label={t("Status")}
            options={[
              { value: "ACTIVE", label: t("Active") },
              { value: "INACTIVE", label: t("Inactive") },
              { value: "COMPLETED", label: t("Completed") },
            ]}
            selected={status}
            setSelected={setStatus}
          />
        </div>
      </Card>
    </Layout>
  );
};

export default StakingPoolCreate;
