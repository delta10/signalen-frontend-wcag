import { FormStoreState } from '@/types/stores'

/**
 * Retrieves valid `File` objects from the `attachments` property of the `formState`.
 *
 * When the browser is refreshed, files stored in local storage may lose their `File` type,
 * resulting in invalid or corrupted data. This function ensures that only valid `File` objects
 * are returned, filtering out any other data types.
 *
 * @param {FormStoreState} formState - The current state of the form, which includes an `attachments` array.
 * @returns {File[]} - An array of valid `File` objects. Returns an empty array if no valid files are found.
 */
export const getAttachments = (formState: FormStoreState): File[] => {
  const filesArray = formState.attachments.filter(
    (file: File) => file instanceof File
  )

  return filesArray.length > 0 ? filesArray : []
}
