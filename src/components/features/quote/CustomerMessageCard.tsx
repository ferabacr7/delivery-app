import React from "react";

import SectionCard from "../../ui/SectionCard";
import InfoRow from "../../ui/InfoRow";

type Props = {
  title: string;
  message: string;
};

export default function CustomerMessageCard({
  title,
  message,
}: Props) {
  return (
    <SectionCard title={title}>
      <InfoRow label="Detalle" value={message} />
    </SectionCard>
  );
}