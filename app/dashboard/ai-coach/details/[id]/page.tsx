import PrintAsPDFComponent from '@/components/Client/PrintAsPDFComponent';
import { getDataAiResultById } from '@/lib/ai-respons/getDataAiResultById';
import { AiResultType } from '@/lib/types/type';
import { getAuthenticatedUser } from '@/utils/getAuthenticatedUser';
import { redirect } from 'next/navigation';
import React from 'react'

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function page({ params }: PageProps) {
  const { id } = await params;
  const verifyUid = await getAuthenticatedUser();
  if (!verifyUid) {
    redirect('auth/login');
  }
  const data = (await getDataAiResultById(verifyUid, id)) as AiResultType;

  const serializableData = JSON.parse(JSON.stringify(data))
  return (
    <div>
      {/* <div>{JSON.stringify(data, null, 2)}</div> */}
      <PrintAsPDFComponent result={serializableData as AiResultType} />
    </div>
  )
}
