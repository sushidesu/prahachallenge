import styles from "./Select.module.css"

type SelectProps = Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  "className"
> & {
  options: OptionItem[]
}

export type OptionItem = {
  label: string
  value: string
}

export const Select = (props: SelectProps): JSX.Element => {
  const { options, ...rest } = props
  return (
    <div className={styles["wrapper"]}>
      <select {...rest} className={styles["select"]}>
        {options.map((option, i) => (
          <option key={i} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
