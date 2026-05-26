"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"

export default function EmployeeDetailPage() {
  const params = useParams()
  const router = useRouter()

  useEffect(() => {
    router.replace(`/employees/${params.id}/raport`)
  }, [params.id, router])

  return null
}
