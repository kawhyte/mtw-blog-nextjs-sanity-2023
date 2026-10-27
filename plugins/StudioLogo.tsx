/** The MTW logo (same as the site navbar) for the Studio's top-left corner */
export function StudioLogo() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/icon/icon.jpg"
      alt="Meet the Whytes"
      style={{ width: '100%', height: '100%', borderRadius: 6, objectFit: 'cover' }}
    />
  )
}
