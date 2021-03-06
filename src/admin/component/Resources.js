import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { Link } from 'react-router-dom'
import {
  Pagination,
  Spinner,
  Table,
  Column,
  MenuItem,
  Badge,
  Modal,
  Button,
} from 'react-rainbow-components'
import { IoIosRemoveCircleOutline } from 'react-icons/io'
import { TiUpload } from 'react-icons/ti'
import GET_FILES, { DELETE_RESOURCES } from '../queries/resources.query'
import ErrorPage from '../../core/component/utils/ErrorPage'
import '../styles/styles.css'
import { renderPaginatedData } from '../../core/component/utils/utils'
import FileUploads from './Uploads'

const badgeStyles = { color: '#1de9b6' }

const StatusBadge = ({ value }) => (
  <Badge label={value} variant="lightest" style={badgeStyles} />
)
function ResourceList({ match }) {
  const topicId = match.params.id

  const { loading, data, error } = useQuery(GET_FILES, {
    variables: { topicId },
  })
  //   const [createtopic] = useMutation(CREATE_TOPIC)
  const [deleteResources] = useMutation(DELETE_RESOURCES)
  const [activePage, setActivePage] = useState(1)
  const [isOpen, setModal] = useState(false)
  const [name, setName] = useState('') // eslint-disable-line
  // const [resourceIds, setTopicIds] = useState([])
  const itemsPerPage = 10
  let resourceIds = []

  function handleOnChange(event, page) {
    setActivePage(page)
  }

  if (loading) {
    return (
      <div className="rainbow-p-vertical_xx-large">
        <div className="rainbow-position_relative rainbow-m-vertical_xx-large rainbow-p-vertical_xx-large">
          <Spinner size="large" />
        </div>
      </div>
    )
  }

  if (error) return <ErrorPage />

  function handleOnClick(data) {
    setModal(true)
    setName(data.name)
  }
  function handleOnClose() {
    setModal(false)
  }
  function handleOnDelete() {
    if (!resourceIds.length) {
      return null
    }
    deleteResources({
      variables: { ids: resourceIds },
      refetchQueries: [{ query: GET_FILES, variables: { topicId } }],
    })
  }

  return (
    <div className="rainbow-p-bottom_xx-large">
      <Modal id="modal-1" isOpen={isOpen} onRequestClose={handleOnClose}>
        <FileUploads topicId={topicId} />
      </Modal>
      <div>
        <Button
          variant="neutral"
          className="rainbow-m-around_medium"
          onClick={() => setModal(true)}
        >
          Upload New
          <TiUpload size={'1.5em'} />
        </Button>
        <Button
          variant="neutral"
          className="rainbow-m-around_medium"
          onClick={handleOnDelete}
        >
          Delete
          <IoIosRemoveCircleOutline size={'2em'} />
        </Button>

        <Table
          keyField="_id"
          isLoading={loading}
          data={renderPaginatedData(
            data.getResourcesByTopicId,
            activePage,
            itemsPerPage
          )}
          showCheckboxColumn
          maxRowSelection={itemsPerPage}
          selectedRows={['1234qwerty', '1234zxcvbn']}
          onRowSelection={data => {
            // To avoid an overflow in states, directly mutate the ids
            const ids = data.map(topic => topic._id)
            resourceIds = ids
          }}
        >
          <Column
            header="Name"
            field="filename"
            component={({ value, row }) => (
              <Link
                className="react-rainbow-admin-users_user-id-cell-container"
                to={`/admin/topic/${row._id}`}
              >
                <div className="react-rainbow-admin-users_user-id-cell rainbow-color_brand">
                  {value.replace(/\.[^/.]+$/, '')}
                </div>
              </Link>
            )}
          />
          <Column
            header="created At"
            field="createdAt"
            component={StatusBadge}
          />
          <Column header="Uploaded By" field="createdByName" />
          <Column type="action">
            <MenuItem label="Edit" onClick={(e, data) => handleOnClick(data)} />
            <MenuItem label="Delete" onClick={handleOnDelete} />
          </Column>
        </Table>
        {(data.getResourcesByTopicId.length < 10) &
        (
          <Pagination
            className="rainbow-m_auto"
            pages={data.getResourcesByTopicId.length / itemsPerPage}
            activePage={activePage}
            onChange={handleOnChange}
          />
        ) || null}
      </div>
    </div>
  )
}
export default ResourceList
