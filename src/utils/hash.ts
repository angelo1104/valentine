import crypto from "crypto";

const hash = (data: any) => {
  const json = JSON.stringify(data);

  return crypto.createHash("sha256").update(json).digest("hex");
};

export default hash;
