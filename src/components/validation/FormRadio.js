import React from 'react'
import { Radio, FormLabel, FormControlLabel, Grid } from '@mui/material'
import PropTypes from 'prop-types'
import { makeStyles } from '@mui/styles'
import { ErrorMessage, useField } from 'formik'
import { TextError } from 'components/Utilities'

const useStyles = makeStyles((theme) => ({
  radio: {
    '& .MuiSvgIcon-root': {
      fontSize: 28,
    },
  },
}))

const MyRadio = ({ label, ...props }) => {
  const [field] = useField(props)
  return (
    <>
      <FormControlLabel control={<Radio />} label={label} {...field} />
    </>
  )
}
const FormRadio = ({
  label,
  labelPlacement,
  onChange,
  values,
  value,
  name,
  ...rest
}) => {
  const classes = useStyles()
  return (
    <Grid container direction="column" gap={2}>
      <FormLabel>{label}</FormLabel>
      {values.map((i) => {
        return (
          <Grid item>
            <MyRadio
              name={name}
              type="radio"
              value={i.value}
              label={i.key}
              as={MyRadio}
            />
            <ErrorMessage
              name={name}
              component={TextError}
              className={classes.radio}
            />
          </Grid>
        )
      })}
    </Grid>
  )
}
FormRadio.propTypes = {
  value: PropTypes.string,
  label: PropTypes.string,
  values: PropTypes.array,
  labelPlacement: PropTypes.element,
}
export default FormRadio
