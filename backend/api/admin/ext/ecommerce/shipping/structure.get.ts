// /api/admin/ecommerceShipping/structure.get.ts

import { structureSchema } from "@b/utils/constants";

export const metadata = {
  summary: "Get form structure for E-commerce Shipping",
  operationId: "getEcommerceShippingtructure",
  tags: ["Admin", "Ecommerce Shipping"],
  responses: {
    200: {
      description: "Form structure for managing E-commerce Shipping",
      content: structureSchema,
    },
  },
  permission: "Access Ecommerce Shipping Management",
};

export const ecommerceShippingtructure = () => {
  const loadId = {
    type: "input",
    label: "Load ID",
    name: "loadId",
    placeholder: "Enter the load ID",
    icon: "lets-icons:load-id",
  };

  const loadStatus = {
    type: "select",
    label: "Load Status",
    name: "loadStatus",
    options: [
      { value: "PENDING", label: "Pending" },
      { value: "TRANSIT", label: "In Transit" },
      { value: "DELIVERED", label: "Delivered" },
      { value: "CANCELLED", label: "Cancelled" },
    ],
    placeholder: "Select the load status",
  };

  const shipper = {
    type: "input",
    label: "Shipper",
    name: "shipper",
    placeholder: "Enter the shipper's name",
    icon: "lets-icons:shipper",
  };

  const transporter = {
    type: "input",
    label: "Transporter",
    name: "transporter",
    placeholder: "Enter the transporter's name",
    icon: "lets-icons:transporter",
  };

  const goodsType = {
    type: "input",
    label: "Goods Type",
    name: "goodsType",
    placeholder: "Enter the type of goods",
    icon: "lets-icons:goods-type",
  };

  const weight = {
    type: "input",
    label: "Weight (kg)",
    name: "weight",
    placeholder: "Enter the weight of the goods",
    icon: "lets-icons:weight",
    ts: "number",
  };

  const volume = {
    type: "input",
    label: "Volume (cm³)",
    name: "volume",
    placeholder: "Enter the volume of the goods",
    icon: "lets-icons:volume",
    ts: "number",
  };

  const description = {
    type: "textarea",
    label: "Description",
    name: "description",
    placeholder: "Enter the description of the goods",
    icon: "lets-icons:description",
  };

  const vehicle = {
    type: "input",
    label: "Vehicle",
    name: "vehicle",
    placeholder: "Enter the vehicle ID",
    icon: "lets-icons:vehicle",
  };

  const cost = {
    type: "input",
    label: "Cost",
    name: "cost",
    placeholder: "Enter the cost of shipping",
    icon: "lets-icons:cost",
    ts: "number",
  };

  const tax = {
    type: "input",
    label: "Tax",
    name: "tax",
    placeholder: "Enter the tax amount",
    icon: "lets-icons:tax",
    ts: "number",
  };

  return {
    loadId,
    loadStatus,
    shipper,
    transporter,
    goodsType,
    weight,
    volume,
    description,
    vehicle,
    cost,
    tax,
  };
};

export default async () => {
  const {
    loadId,
    loadStatus,
    shipper,
    transporter,
    goodsType,
    weight,
    volume,
    description,
    vehicle,
    cost,
    tax,
  } = ecommerceShippingtructure();

  return {
    get: [
      {
        type: "input",
        component: "InfoBlock",
        label: "Load ID",
        name: "loadId",
        icon: "lets-icons:load-id",
      },
      {
        type: "input",
        component: "InfoBlock",
        label: "Load Status",
        name: "loadStatus",
        icon: "lets-icons:load-status",
      },
      {
        type: "input",
        component: "InfoBlock",
        label: "Shipper",
        name: "shipper",
        icon: "lets-icons:shipper",
      },
      {
        type: "input",
        component: "InfoBlock",
        label: "Transporter",
        name: "transporter",
        icon: "lets-icons:transporter",
      },
      {
        type: "input",
        component: "InfoBlock",
        label: "Goods Type",
        name: "goodsType",
        icon: "lets-icons:goods-type",
      },
      {
        type: "input",
        component: "InfoBlock",
        label: "Weight (kg)",
        name: "weight",
        icon: "lets-icons:weight",
      },
      {
        type: "input",
        component: "InfoBlock",
        label: "Volume (cm³)",
        name: "volume",
        icon: "lets-icons:volume",
      },
      {
        type: "textarea",
        component: "InfoBlock",
        label: "Description",
        name: "description",
        icon: "lets-icons:description",
      },
      {
        type: "input",
        component: "InfoBlock",
        label: "Vehicle",
        name: "vehicle",
        icon: "lets-icons:vehicle",
      },
      {
        type: "input",
        component: "InfoBlock",
        label: "Cost",
        name: "cost",
        icon: "lets-icons:cost",
      },
      {
        type: "input",
        component: "InfoBlock",
        label: "Tax",
        name: "tax",
        icon: "lets-icons:tax",
      },
      loadStatus,
    ],
    set: [
      [loadId, loadStatus],
      [shipper, transporter],
      [weight, volume],
      description,
      [goodsType, vehicle],
      [cost, tax],
    ],
  };
};
