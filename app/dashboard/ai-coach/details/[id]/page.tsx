import PrintAsPDFComponent from '@/components/Client/PrintAsPDFComponent';
import { getDataAiResultById } from '@/lib/ai-respons/getDataAiResultById';
import { AiResultType } from '@/lib/types/type';
import React from 'react'

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function page({ params }: PageProps) {
  const { id } = await params;
  const data = await getDataAiResultById(id);
  return (
    <div>
      {/* <div>{JSON.stringify(data, null, 2)}</div> */}
      <PrintAsPDFComponent result={data as AiResultType} />
    </div>
  )
}
