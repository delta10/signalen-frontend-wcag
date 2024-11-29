// todo: check I18nConfig once we have settled on a more robust language dictionary structure
export interface I18nConfig {
  homepage: {
    welcome: string
  }
  stepper: {
    back: string
    step: string
  }
  'describe-report': {
    heading: string
    form: {
      describe_textarea_heading: string
      required_short: string
      not_required_short: string
      describe_textarea_description: string
      describe_upload_heading: string
      describe_upload_description: string
      errors: {
        textarea_required: string
        file_type_invalid: string
        file_size_too_large: string
        file_size_too_small: string
        file_limit_exceeded: string
      }
    }
  }
  'describe-add': {
    heading: string
    form: {
      add_map_heading: string
      add_choose_location_button: string
      errors: {
        location_required: string
      }
    }
    map: {
      map_heading: string
      map_label: string
      required_short: string
      choose_location: string
      dialog_title: string
      dialog_description: string
      current_location: string
      outside_max_bound_error: string
      close_alert_notification: string
      address_search_label: string
    }
  }
  'describe-contact': {
    heading: string
    form: {
      heading: string
      description: string
      send_to_other_instance_heading: string
      send_to_other_instance_description: string
      describe_phone_input_heading: string
      describe_mail_input_heading: string
      describe_checkbox_input_description: string
      errors: {
        number_not_valid: string
        email_not_valid: string
      }
      not_required_short: string
    }
  }
  'describe-summary': {
    heading: string
    description: string
    steps: {
      step_one: {
        title: string
        edit: string
        input_heading: string
        upload_images: string
      }
      step_two: {
        title: string
        edit: string
        input_heading: string
      }
      step_three: {
        title: string
        edit: string
        no_contact_details: string
        input_telephone_heading: string
        input_mail_heading: string
        input_sharing_heading: string
        input_sharing_allowed: string
      }
    }
    submit_alert: {
      error: {
        heading: string
        description: string
      }
      loading: {
        heading: string
        description: string
      }
    }
  }
  'describe-thankyou': {
    heading: string
    description_notification_number: string
    description_notification_email: string
    what_do_we_do_heading: string
    what_do_we_do_description: string
    new_notification: string
  }
  general: {
    describe_form: {
      'title-separator': string
      'title-prefix-error': string
      'pre-heading': string
      back_button: string
      next_button: string
      submit_button: string
      'not-required': string
    }
    errors: {
      required: string
      max_length: string
      not_required_short: string
      required_short: string
      location_required: string
      is_blocking: string
    }
    button: {
      upload_file: string
      delete_file: string
    }
    file: {
      preview: string
    }
  }
  routing: {
    'notifications-map': string
    incident: string
  }
  'current-organisation': {
    name: string
    'homepage-label': string
    'logo-label': string
  }
}
