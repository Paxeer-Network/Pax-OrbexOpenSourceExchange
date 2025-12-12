"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/layouts/Default";
import $fetch from "@/utils/api";
import Card from "@/components/elements/base/card/Card";
import Button from "@/components/elements/base/button/Button";
import Input from "@/components/elements/form/input/Input";
import Textarea from "@/components/elements/form/textarea/Textarea";
import InputFile from "@/components/elements/form/input-file/InputFile";
import ListBox from "@/components/elements/form/listbox/Listbox";
import { useTranslation } from "next-i18next";
import { imageUploader } from "@/utils/upload";
import { BackButton } from "@/components/elements/base/button/BackButton";
import { toast } from "sonner";

interface Option {
  value: string;
  label: string;
}

const NftAssetEdit: React.FC = () => {
  const { t } = useTranslation();
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<string>("");
  const [creatorId, setCreatorId] = useState<string>("");
  const [ownerId, setOwnerId] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [network, setNetwork] = useState<string>("");
  const [royalty, setRoyalty] = useState<string>("");
  const [status, setStatus] = useState<Option | null>(null);
  const router = useRouter();
  const { id } = router.query;

  const statusOptions: Option[] = [
    { value: "true", label: t("Active") },
    { value: "false", label: t("Inactive") },
  ];

  useEffect(() => {
    if (router.isReady) {
      fetchAssetData();
    }
  }, [router.isReady]);

  const fetchAssetData = async () => {
    if (!id) return;
    const { data, error } = await $fetch({
      url: `/api/admin/ext/nft/asset/${id}`,
      silent: true,
    });
    if (!error && data) {
      setName(data.name);
      setDescription(data.description);
      setImageUrl(data.image);
      setMetadata(data.metadata);
      setCreatorId(data.creatorId);
      setOwnerId(data.ownerId);
      setPrice(data.price?.toString() || "");
      setNetwork(data.network);
      setRoyalty(data.royalty?.toString() || "");
      setStatus(
        statusOptions.find(
          (option) => option.value === data.status.toString()
        ) || null
      );
    }
  };

  const handleSubmit = async () => {
    const body = {
      name,
      description,
      image: imageUrl || "",
      metadata,
      creatorId,
      ownerId,
      price: price ? parseFloat(price) : null,
      network,
      royalty: royalty ? parseFloat(royalty) : null,
      status: status?.value === "true",
    };

    const { error } = await $fetch({
      url: `/api/admin/ext/nft/asset/${id}`,
      method: "PUT",
      body,
    });

    if (!error) {
      toast.success(t("NFT Asset updated successfully"));
      router.push(`/admin/ext/nft/asset`);
    } else {
      toast.error(t("Failed to update NFT Asset"));
    }
  };

  const handleFileUpload = async (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      const result = await imageUploader({
        file,
        dir: `nft/assets`, // Directory for storing NFT asset images
        size: {
          maxWidth: 1024,
          maxHeight: 1024,
        },
        oldPath: imageUrl || undefined, // Replace old image if exists
      });

      if (result.success) {
        setImageUrl(result.url);
      } else {
        console.error("Error uploading file");
      }
    }
  };

  return (
    <Layout title={t("Edit NFT Asset")} color="muted">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold dark:text-white">
          {t("Edit NFT Asset")}
        </h1>
        <BackButton href="/admin/ext/nft/asset" />
      </div>
      <Card className="p-5 mb-5 text-muted-800 dark:text-muted-100">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0"></div>
          <div className="flex gap-2">
            <Button
              onClick={() => router.push(`/admin/ext/nft/asset`)}
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
            id="nft-asset-image"
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
            labelAlt={`${t("Recommended Size")}: 1024x1024 px`}
            bordered
            color="default"
            onChange={handleFileUpload}
            onRemoveFile={() => setImageUrl(null)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <Input
            label={t("Name")}
            placeholder={t("Enter the NFT asset name")}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Textarea
            label={t("Description")}
            placeholder={t("Enter the NFT asset description")}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Input
            label={t("Metadata")}
            placeholder={t("Enter metadata URL or JSON")}
            value={metadata}
            onChange={(e) => setMetadata(e.target.value)}
          />
          <Input
            label={t("Creator ID")}
            placeholder={t("Enter the creator's user ID")}
            value={creatorId}
            onChange={(e) => setCreatorId(e.target.value)}
          />
          <Input
            label={t("Owner ID")}
            placeholder={t("Enter the owner's user ID")}
            value={ownerId}
            onChange={(e) => setOwnerId(e.target.value)}
          />
          <Input
            label={t("Price")}
            placeholder={t("Enter the price")}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <Input
            label={t("Network")}
            placeholder={t("Enter the blockchain network")}
            value={network}
            onChange={(e) => setNetwork(e.target.value)}
          />
          <Input
            label={t("Royalty")}
            placeholder={t("Enter the royalty percentage")}
            value={royalty}
            onChange={(e) => setRoyalty(e.target.value)}
          />
          <ListBox
            label={t("Status")}
            options={statusOptions}
            selected={status}
            setSelected={setStatus}
          />
        </div>
      </Card>
    </Layout>
  );
};

export default NftAssetEdit;
export const permission = "Access NFT Asset Management";
