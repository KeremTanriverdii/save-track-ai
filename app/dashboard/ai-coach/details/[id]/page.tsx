import PrintAsPDFComponent from '@/components/Client/PrintAsPDFComponent';
import { getDataAiResultById } from '@/lib/ai-respons/getDataAiResultById';
import { AiResultType } from '@/lib/types/type';
import { getAuthenticatedUser } from '@/utils/getAuthenticatedUser';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

type PageProps = {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = ({
  title: 'Ai Result'
})

export default async function page({ params }: PageProps) {
  const { id } = await params;
  const verifyUid = await getAuthenticatedUser();
  if (!verifyUid) {
    redirect('auth/login');
  }
  const data = (await getDataAiResultById(verifyUid.uid, id)) as AiResultType;

  const serializableData = JSON.parse(JSON.stringify(data))
  return (
    <div>
      <PrintAsPDFComponent result={serializableData as AiResultType} />
    </div>
  )
}
