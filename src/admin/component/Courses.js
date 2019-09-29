import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import { IoMdMore } from 'react-icons'
import { GlobalHeader, ButtonGroup, Spinner, Table, Column, MenuItem, Badge } from 'react-rainbow-components'
import GET_COURSES from '../queries/courses'


const badgeStyles = { color: '#1de9b6' };

const StatusBadge = ({ value }) => <Badge label={value} variant="lightest" style={badgeStyles} />;
function CoursesList() {
    const { loading, data, error } = useQuery(GET_COURSES)
    if (loading) return (
        <div className="rainbow-p-vertical_xx-large">
            <div className="rainbow-position_relative rainbow-m-vertical_xx-large rainbow-p-vertical_xx-large">
                <Spinner size="large" />
            </div>
        </div>
    )
    if (error) return <p>Error :(</p>;
    return (
        <div className="rainbow-p-bottom_xx-large">
            <Table keyField="id" data={data.getCourses}>
                <Column header="Name" field="name" />
                <Column header="created At" field="createdAt" component={StatusBadge} />
                <Column header="created By" field="createdBy" />
                {/* <Column header="Email" field="email" /> */}
                <Column type="action">
                    <MenuItem label="Edit" onClick={(e, data) => console.log(`Edit ${data.name}`)} />
                    <MenuItem label="Delete" onClick={(e, data) => console.log(`Delete ${data.name}`)} />
                </Column>
            </Table>
        </div>
    )
}
export default CoursesList


