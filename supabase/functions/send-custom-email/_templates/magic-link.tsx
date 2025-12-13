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

interface MagicLinkEmailProps {
  magic_link_url: string
  token: string
}

export const MagicLinkEmail = ({
  magic_link_url,
  token,
}: MagicLinkEmailProps) => (
  <Html dir="rtl">
    <Head />
    <Preview>لینک ورود - {APP_NAME}</Preview>
    <Body style={styles.main}>
      <Container style={styles.container}>
        <Section style={{ padding: '0 48px' }}>
          <Heading style={styles.h1}>🔗 ورود با لینک جادویی</Heading>
          <Text style={styles.text}>سلام،</Text>
          <Text style={styles.text}>
            برای ورود به سامانه ایمنی و بهداشت، روی دکمه زیر کلیک کنید:
          </Text>
          <Link href={magic_link_url} style={styles.button}>
            ورود به سامانه
          </Link>
          <Text style={{ ...styles.text, fontSize: '14px', color: '#666' }}>
            یا کد ورود زیر را وارد کنید:
          </Text>
          <code style={styles.code}>{token}</code>
          <Hr style={styles.hr} />
          <Text style={{ ...styles.text, fontSize: '14px', color: '#dc2626' }}>
            ⚠️ این لینک فقط یک بار قابل استفاده است.
          </Text>
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

export default MagicLinkEmail
