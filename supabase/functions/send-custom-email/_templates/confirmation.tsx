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

interface ConfirmationEmailProps {
  confirmation_url: string
  token: string
}

export const ConfirmationEmail = ({
  confirmation_url,
  token,
}: ConfirmationEmailProps) => (
  <Html dir="rtl">
    <Head />
    <Preview>تأیید ایمیل - {APP_NAME}</Preview>
    <Body style={styles.main}>
      <Container style={styles.container}>
        <Section style={{ padding: '0 48px' }}>
          <Heading style={styles.h1}>🛡️ {APP_NAME}</Heading>
          <Text style={styles.text}>سلام،</Text>
          <Text style={styles.text}>
            از ثبت‌نام شما در سامانه ایمنی و بهداشت متشکریم. برای تأیید ایمیل خود، روی دکمه زیر کلیک کنید:
          </Text>
          <Link href={confirmation_url} style={styles.button}>
            تأیید ایمیل
          </Link>
          <Text style={{ ...styles.text, fontSize: '14px', color: '#666' }}>
            یا کد تأیید زیر را وارد کنید:
          </Text>
          <code style={styles.code}>{token}</code>
          <Hr style={styles.hr} />
          <Text style={styles.footer}>
            اگر این درخواست از طرف شما نبوده، می‌توانید این ایمیل را نادیده بگیرید.
          </Text>
          <Text style={styles.footer}>
            {APP_NAME_EN} | {APP_NAME}
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default ConfirmationEmail
