import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/layouts/Default";
import $fetch, { $serverFetch } from "@/utils/api";
import Card from "@/components/elements/base/card/Card";
import Button from "@/components/elements/base/button/Button";
import Input from "@/components/elements/form/input/Input";
import ListBox from "@/components/elements/form/listbox/Listbox";
import InputFile from "@/components/elements/form/input-file/InputFile";
import { useTranslation } from "next-i18next";
import RichTextEditor from "@/components/elements/addons/RichTextEditor";
import { imageUploader } from "@/utils/upload";
import Textarea from "@/components/elements/form/textarea/Textarea";

interface Option {
  value: string;
  label: string;
}

interface EcommerceProductCreateProps {
  initialFormData: {
    categories: Option[];
    walletTypes: Option[];
    currencyConditions: Record<string, Option[]>;
  };
}

const EcommerceProductCreate: React.FC<EcommerceProductCreateProps> = ({
  initialFormData,
}) => {
  const { t } = useTranslation();
  const router = useRouter();

  const [formData, setFormData] = useState(initialFormData);

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>(""); // Use for the RichTextEditor
  const [shortDescription, setShortDescription] = useState<string>("");
  const [type, setType] = useState<Option | null>(null);
  const [price, setPrice] = useState<string>("");
  const [category, setCategory] = useState<Option | null>(null);
  const [inventoryQuantity, setInventoryQuantity] = useState<string>("");
  const [filePath, setFilePath] = useState<string | null>(null);
  const [walletType, setWalletType] = useState<Option | null>(null);
  const [currency, setCurrency] = useState<Option | null>(null);
  const [status, setStatus] = useState<Option | null>(null);

  const handleSubmit = async () => {
    const body = {
      name,
      description,
      shortDescription,
      type: type?.value,
      price: parseFloat(price),
      categoryId: category?.value,
      inventoryQuantity: parseInt(inventoryQuantity),
      image: filePath,
      walletType: walletType?.value,
      currency: currency?.value,
      status: status?.value,
    };

    const { error } = await $fetch({
      url: "/api/admin/ext/ecommerce/product",
      method: "POST",
      body,
    });

    if (!error) {
      router.push(`/admin/ext/ecommerce/product`);
    }
  };

  const handleFileUpload = async (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      const result = await imageUploader({
        file,
        dir: `ecommerce/products`,
        size: {
          maxWidth: 720,
          maxHeight: 720,
        },
      });

      if (result.success) {
        setFilePath(result.url);
      } else {
        console.error("Error uploading file");
      }
    }
  };

  const getCurrencyOptions = () => {
    if (!walletType || !formData) return [];
    return formData.currencyConditions[walletType.value] || [];
  };

  if (!formData) return null;

  return (
    <Layout title={t("Create E-commerce Product")} color="muted">
      <Card className="p-5 mb-5 text-muted-800 dark:text-muted-100">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-lg">{t("New Product")}</h1>
          <div className="flex gap-2">
            <Button
              onClick={() => router.push(`/admin/ext/ecommerce/product`)}
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
              {t("Create")}
            </Button>
          </div>
        </div>
        <InputFile
          id="product-image"
          acceptedFileTypes={["image/png", "image/jpeg", "image/webp"]}
          preview={filePath}
          previewPlaceholder="/img/placeholder.svg"
          maxFileSize={16}
          label={`${t("Max File Size")}: 16 MB`}
          onChange={handleFileUpload}
          onRemoveFile={() => setFilePath(null)}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <ListBox
            label={t("Type")}
            options={[
              { value: "DOWNLOADABLE", label: t("Downloadable") },
              { value: "PHYSICAL", label: t("Physical") },
            ]}
            selected={type}
            setSelected={setType}
          />
          <ListBox
            label={t("Category")}
            options={formData.categories}
            selected={category}
            setSelected={setCategory}
          />
          <Input
            label={t("Name")}
            placeholder={t("Enter the product name")}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label={t("Price")}
            placeholder={t("Enter the product price")}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <ListBox
            label={t("Wallet Type")}
            options={formData.walletTypes}
            selected={walletType}
            setSelected={(option) => {
              setWalletType(option);
              setCurrency(null); // Reset currency when wallet type changes
            }}
          />
          <ListBox
            label={t("Currency")}
            options={getCurrencyOptions()}
            selected={currency}
            setSelected={setCurrency}
          />
          <Input
            label={t("Inventory Quantity")}
            placeholder={t("Enter inventory quantity")}
            value={inventoryQuantity}
            onChange={(e) => setInventoryQuantity(e.target.value)}
          />
          <ListBox
            label={t("Status")}
            options={[
              { value: true, label: t("Yes") },
              { value: false, label: t("No") },
            ]}
            selected={status}
            setSelected={setStatus}
          />
        </div>
        <Textarea
          label={t("Short Description")}
          placeholder={t("Enter the product short description")}
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
        />
        <div className="my-6">
          <h2 className="text-md font-semibold mb-2">{t("Description")}</h2>
          <RichTextEditor
            value={description}
            onChange={setDescription}
            placeholder={t("Compose product description here...")}
          />
        </div>
      </Card>
    </Layout>
  );
};

export async function getServerSideProps(context: any) {
  try {
    const { data } = await $serverFetch(context, {
      url: `/api/admin/ext/ecommerce/product/data`,
    });

    return {
      props: {
        initialFormData: data || null,
      },
    };
  } catch (error) {
    console.error("Error fetching form data:", error);
    return {
      props: {
        initialFormData: null,
      },
    };
  }
}

export default EcommerceProductCreate;
