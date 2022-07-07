import React from 'react'
import TextField from '@material-ui/core/TextField'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Formik, Form, Field } from 'formik'
import SendIcon from '@material-ui/icons/Send'
import Button from '@material-ui/core/Button'
import { useActions } from 'components/hooks/useActions'

const useStyles = makeStyles((theme) =>
  createStyles({
    wrapForm: {
      marginTop: 'auto',
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      gap: 2,
    },
    wrapText: {
      '& .MuiInputBase-root': {
        height: '5rem',
        fontSize: '1.3rem',
        padding: '2rem',
      },
      width: '100%',
      display: 'flex',
      flexBasis: '90%',
    },
    button: {
      background: 'green',
      color: 'white',
      //margin: theme.spacing(1),
    },
  }),
)

const TextChat = () => {
  const { chat } = useActions()
  const classes = useStyles()
  const initialValues = {
    input: '',
  }
  const onSubmit = (values, onSubmitProps) => {
    onSubmitProps.resetForm()
    chat(values.input)
    console.log(values)
  }
  return (
    <>
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {(formik) => {
          return (
            <Form className={classes.wrapForm} noValidate autoComplete="off">
              <Field
                as={TextField}
                disableUnderline={true}
                name="input"
                placeholder="Enter Message here"
                disableRipple
                className={classes.wrapText}
              />
              <Button
                variant="contained"
                type="submit"
                disabled={
                  formik.isSubmitting || !(formik.dirty && formik.isValid)
                }
                className={classes.button}
              >
                <SendIcon />
              </Button>
            </Form>
          )
        }}
      </Formik>
    </>
  )
}
export default TextChat
