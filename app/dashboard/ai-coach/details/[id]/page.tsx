import { getDataAiResultById } from '@/lib/ai-respons/getDataAiResultById';
import React from 'react'

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function page({ params }: PageProps) {
  const { id } = await params;
  const data = await getDataAiResultById(id);
  console.log(data)
  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
