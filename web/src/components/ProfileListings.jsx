import PropTypes from "prop-types"
import Listing from "src/components/Listing"
import {listItemsRootClasses} from "src/components/ListItems"
import useListings from "src/hooks/useListings"
import EmptyImpactXItems from "./EmptyImpactXItems"

export default function ProfileListings({address}) {
  const {data: listingResourceIDs, isLoading} = useListings(address)

  if (!isLoading && (!listingResourceIDs || listingResourceIDs?.length === 0)) {
    return <EmptyImpactXItems />
  }

  return (
    <div>
      <div className={listItemsRootClasses}>
        {listingResourceIDs?.map(listingResourceID => (
          <Listing
            key={listingResourceID}
            address={address}
            listingResourceID={listingResourceID}
            showOwnerInfo={true}
          />
        ))}
      </div>
    </div>
  )
}

ProfileListings.propTypes = {
  address: PropTypes.string,
}
