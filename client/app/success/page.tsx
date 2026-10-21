import PaymentSuccess from '@/components/checkout/PaymentSuccess'

export default async function SuccessPage({
  searchParams,
}: PageProps<'/success'>) {
  const params = await searchParams
  const sessionId = typeof params.session_id === 'string' ? params.session_id : ''

  return <PaymentSuccess sessionId={sessionId} />
}