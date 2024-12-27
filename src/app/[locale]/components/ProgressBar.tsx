import './ProgressBar.css'

export interface ProgressBarProps {
  value: number
}

export const ProgressBar = ({ value }: ProgressBarProps) => (
  <data value={value} className="signalen-progress-bar">
    <span
      className="signalen-progress-bar__complete"
      style={{
        inlineSize: `${Math.min(value * 100, 100)}%`,
      }}
    />
  </data>
)
