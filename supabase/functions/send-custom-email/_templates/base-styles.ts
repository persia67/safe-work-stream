// Shared styles for all email templates
export const styles = {
  main: {
    backgroundColor: '#f6f9fc',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
  },
  container: {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    padding: '20px 0 48px',
    marginBottom: '64px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  },
  logo: {
    margin: '0 auto',
    marginBottom: '24px',
  },
  h1: {
    color: '#1a1a2e',
    fontSize: '24px',
    fontWeight: '600',
    lineHeight: '40px',
    margin: '0 0 20px',
    textAlign: 'center' as const,
  },
  text: {
    color: '#484848',
    fontSize: '16px',
    lineHeight: '26px',
    margin: '16px 0',
  },
  button: {
    backgroundColor: '#16a34a',
    borderRadius: '8px',
    color: '#ffffff',
    display: 'block',
    fontSize: '16px',
    fontWeight: '600',
    textAlign: 'center' as const,
    textDecoration: 'none',
    padding: '14px 24px',
    margin: '24px auto',
    width: 'fit-content',
  },
  code: {
    display: 'inline-block',
    padding: '16px 24px',
    backgroundColor: '#f4f4f4',
    borderRadius: '8px',
    border: '1px solid #eee',
    color: '#333',
    fontSize: '24px',
    fontWeight: '700',
    letterSpacing: '4px',
    textAlign: 'center' as const,
    width: '100%',
    margin: '16px 0',
  },
  footer: {
    color: '#8898aa',
    fontSize: '12px',
    lineHeight: '22px',
    marginTop: '32px',
    textAlign: 'center' as const,
  },
  hr: {
    borderColor: '#e6ebf1',
    margin: '20px 0',
  },
  link: {
    color: '#16a34a',
    textDecoration: 'underline',
  },
};

export const APP_NAME = 'سامانه ایمنی و بهداشت';
export const APP_NAME_EN = 'HSE Management System';
