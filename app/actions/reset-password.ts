"use server"

interface ApiResponse {
  status: boolean
  msg: string
}

export async function sendResetCode(prevState: any, formData: FormData) {
  const email = formData.get("email") as string

  if (!email) {
    return { error: "Email is required" }
  }

  try {
    const response = await fetch("https://n8n-blue.up.railway.app/webhook/ada/api/send-reset-code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })

    const data: ApiResponse = await response.json()

    if (response.status === 201 && data.status) {
      return { success: true, message: data.msg, email }
    } else {
      return { error: data.msg }
    }
  } catch (error) {
    console.error("Error sending reset code:", error)
    return { error: "Failed to send reset code. Please try again." }
  }
}

export async function verifyResetCode(prevState: any, formData: FormData) {
  const email = formData.get("email") as string
  const code = formData.get("code") as string

  if (!email || !code) {
    return { error: "Email and code are required" }
  }

  try {
    const response = await fetch("https://n8n-blue.up.railway.app/webhook/ada/api/verify-reset-code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, code }),
    })

    const data: ApiResponse = await response.json()

    if (response.status === 200 && data.status) {
      return { success: true, message: "Code verified successfully", email }
    } else {
      return { error: data.msg }
    }
  } catch (error) {
    console.error("Error verifying reset code:", error)
    return { error: "Failed to verify code. Please try again." }
  }
}

export async function resetPassword(prevState: any, formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (!email || !password || !confirmPassword) {
    return { error: "Email and passwords are required" }
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" }
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  if (!passwordRegex.test(password)) {
    return {
      error:
        "Password must be at least 8 characters long and include 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character",
    }
  }

  try {
    const response = await fetch("https://n8n-blue.up.railway.app/webhook/ada/api/reset/password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    const data: ApiResponse = await response.json()

    if (data.status) {
      return { success: true, message: "Password reset successfully" }
    } else {
      return { error: data.msg }
    }
  } catch (error) {
    console.error("Error resetting password:", error)
    return { error: "Failed to reset password. Please try again." }
  }
}