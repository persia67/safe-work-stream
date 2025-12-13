import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Hr,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'
import { styles, APP_NAME, APP_NAME_EN } from './base-styles.ts'

interface RecoveryEmailProps {
  recovery_url: string
  token: string
}

export const RecoveryEmail = ({
  recovery_url,
  token,
}: RecoveryEmailProps) => (
  <Html dir="rtl">
    <Head />
    <Preview>بازیابی رمز عبور - {APP_NAME}</Preview>
    <Body style={styles.main}>
      <Container style={styles.container}>
        <Section style={{ padding: '0 48px' }}>
          <Heading style={styles.h1}>🔐 بازیابی رمز عبور</Heading>
          <Text style={styles.text}>سلام،</Text>
          <Text style={styles.text}>
            درخواست بازیابی رمز عبور برای حساب کاربری شما دریافت شد. برای تنظیم رمز عبور جدید، روی دکمه زیر کلیک کنید:
          </Text>
          <Link href={recovery_url} style={styles.button}>
            تنظیم رمز عبور جدید
          </Link>
          <Text style={{ ...styles.text, fontSize: '14px', color: '#666' }}>
            یا کد بازیابی زیر را وارد کنید:
          </Text>
          <code style={styles.code}>{token}</code>
          <Hr style={styles.hr} />
          <Text style={{ ...styles.text, fontSize: '14px', color: '#dc2626' }}>
            ⚠️ این لینک تا ۲۴ ساعت معتبر است.
          </Text>
          <Text style={styles.footer}>
            اگر این درخواست از طرف شما نبوده، لطفاً این ایمیل را نادیده بگیرید. رمز عبور شما تغییر نخواهد کرد.
          </Text>
          <Text style={styles.footer}>
            {APP_NAME_EN} | {APP_NAME}
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default RecoveryEmail
