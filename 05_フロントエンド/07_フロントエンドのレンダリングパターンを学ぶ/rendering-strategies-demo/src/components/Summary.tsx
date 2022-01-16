type SummaryProps = {
  name: string
  stars: number
}

export const Summary = (props: SummaryProps) => {
  const { name, stars } = props
  return (
    <div>
      <p>{`name: ${name}`}</p>
      <p>{`stars: ${stars}`}</p>
    </div>
  )
}
