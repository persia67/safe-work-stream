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

interface InviteEmailProps {
  invite_url: string
  token: string
}

export const InviteEmail = ({
  invite_url,
  token,
}: InviteEmailProps) => (
  <Html dir="rtl">
    <Head />
    <Preview>دعوت به {APP_NAME}</Preview>
    <Body style={styles.main}>
      <Container style={styles.container}>
        <Section style={{ padding: '0 48px' }}>
          <Heading style={styles.h1}>🎉 دعوت به سامانه</Heading>
          <Text style={styles.text}>سلام،</Text>
          <Text style={styles.text}>
            شما به سامانه ایمنی و بهداشت دعوت شده‌اید. برای پذیرش دعوت و ایجاد حساب کاربری، روی دکمه زیر کلیک کنید:
          </Text>
          <Link href={invite_url} style={styles.button}>
            پذیرش دعوت
          </Link>
          <Text style={{ ...styles.text, fontSize: '14px', color: '#666' }}>
            یا کد دعوت زیر را وارد کنید:
          </Text>
          <code style={styles.code}>{token}</code>
          <Hr style={styles.hr} />
          <Text style={styles.footer}>
            اگر نمی‌خواهید به این سامانه بپیوندید، می‌توانید این ایمیل را نادیده بگیرید.
          </Text>
          <Text style={styles.footer}>
            {APP_NAME_EN} | {APP_NAME}
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default InviteEmail
