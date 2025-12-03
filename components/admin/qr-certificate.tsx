'use client'

import { useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, QrCode } from 'lucide-react'
import QRCode from 'qrcode'

interface QRCertificateProps {
  studentName: string
  examName: string
  marks: number
  grade: string
  examId: string
}

export default function QRCertificate({
  studentName,
  examName,
  marks,
  grade,
  examId,
}: QRCertificateProps) {
  const qrRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (qrRef.current) {
      const verificationUrl = `${window.location.origin}/verify/${examId}`
      QRCode.toCanvas(qrRef.current, verificationUrl, { width: 200 })
    }
  }, [examId])

  const downloadCertificate = () => {
    // In production, use a PDF library like jsPDF
    const certificateContent = `
    SmartResult Portal - Exam Result Certificate
    ==========================================
    
    Student: ${studentName}
    Exam: ${examName}
    Marks: ${marks}
    Grade: ${grade}
    
    This certificate is digitally signed and can be verified using the QR code.
    Verification ID: ${examId}
    Date Issued: ${new Date().toLocaleDateString()}
    `

    const blob = new Blob([certificateContent], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `certificate-${studentName}-${examName}.txt`
    a.click()
  }

  return (
    <Card className="max-w-2xl border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="w-5 h-5 text-primary" />
          Digital Certificate
        </CardTitle>
        <CardDescription>QR Verified Result Certificate</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Certificate Content */}
        <div className="p-8 border-4 border-primary/30 rounded-lg bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-foreground">Certificate of Achievement</h2>
            <p className="text-lg text-muted-foreground">This certifies that</p>
            <p className="text-2xl font-bold text-primary">{studentName}</p>
            <p className="text-muted-foreground">has successfully completed</p>
            <p className="text-xl font-semibold text-foreground">{examName}</p>

            <div className="grid grid-cols-2 gap-4 py-6">
              <div className="p-4 bg-white/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Marks Obtained</p>
                <p className="text-2xl font-bold text-primary">{marks}</p>
              </div>
              <div className="p-4 bg-white/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Grade Awarded</p>
                <p className="text-2xl font-bold text-primary">{grade}</p>
              </div>
            </div>

            <div className="pt-6 border-t border-primary/20">
              <p className="text-xs text-muted-foreground">Issued on {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="flex flex-col items-center gap-4">
          <div ref={qrRef} className="border-2 border-border p-4 rounded-lg bg-white"></div>
          <p className="text-xs text-muted-foreground text-center">
            Scan this QR code to verify the authenticity of this certificate
          </p>
        </div>

        {/* Download Button */}
        <Button onClick={downloadCertificate} className="w-full bg-primary hover:bg-primary/90 flex items-center justify-center gap-2">
          <Download className="w-4 h-4" />
          Download Certificate
        </Button>
      </CardContent>
    </Card>
  )
}
