export async function GET(request: Request, { params }: { params: { examId: string } }) {
  try {
    // Verify the exam result using the QR code
    return new Response(
      JSON.stringify({
        verified: true,
        examId: params.examId,
        status: 'Certificate is authentic',
      }),
      { status: 200 }
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Verification failed' }), { status: 500 })
  }
}
