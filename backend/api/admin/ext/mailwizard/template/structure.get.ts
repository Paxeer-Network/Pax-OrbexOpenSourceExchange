// /api/mailwizardTemplates/structure.get.ts

import { structureSchema } from "@b/utils/constants";

export const metadata = {
  summary: "Get form structure for Mailwizard Templates",
  operationId: "getMailwizardTemplateStructure",
  tags: ["Admin","Mailwizard Templates"],
  responses: {
    200: {
      description: "Form structure for managing Mailwizard Templates",
      content: structureSchema,
    },
  },
  permission: "Access Mailwizard Template Management"
};

export const mailwizardTemplateStructure = () => {
  const name = {
    type: "input",
    label: "Name",
    name: "name",
    placeholder: "Enter the template name",
  };

  const content = {
    type: "textarea",
    label: "Content",
    name: "content",
    placeholder: "Enter the email content HTML or Text",
  };

  const design = {
    type: "textarea",
    label: "Design",
    name: "design",
    placeholder: "Describe the design and layout",
  };

  return {
    name,
    content,
    design,
  };
};

export default (): object => {
  const { name, content, design } = mailwizardTemplateStructure();

  return {
    get: [name, content, design],
    set: [name],
    import: [name, content, design],
  };
};
