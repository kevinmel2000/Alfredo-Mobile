import React, {useEffect, useState} from 'react'
import { SafeAreaView, ActivityIndicator, RefreshControl, FlatList, Image, View, Text } from 'react-native'
import { connect } from 'react-redux'
import CategoryActions from "../Redux/CategoryRedux";

// Styles
import styles from './Styles/ProductsStyle'
import { apply } from '../Lib/OsmiProvider';
import HeaderStyle from '../Navigation/Styles/NavigationStyles'
import ArrowBack from '../Components/ArrowBack'

const Products = props => {
  const {category} = props
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    props.getCategory({})
  }, [])

  const pullToRefresh = () => {
    props.getCategory({})
  }

  const renderItem = ({ item, index }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.thumbnail }} style={styles.thumb} />
      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.desc}>{item.desc.substr(0, 79)}...</Text>
      </View>
    </View>
  )

  console.tron.log("=== ini titid ===", props.category)

  return (
    <SafeAreaView style={apply('bg-gray-500 flex')}>
      {category?.fetching ? (
        <View style={apply('flex justify-center items-center')}>
          <ActivityIndicator size="large" color={apply('gray-900')} />
        </View>
      ) : (
        <FlatList
          data={category.data}
          initialNumToRender={3}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => pullToRefresh()} />
          }
          renderItem={renderItem}
          ListEmptyComponent={() =>(
            <View>
              <Text>Tidak ada data ditampilkam</Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  )
}

const mapStateToProps = (state) => ({
  category: state.category.list
})

const mapDispatchToProps = (dispatch) => ({
  getCategory: value => dispatch(CategoryActions.getCategoryRequest(value))
})

Products.navigationOptions = ({ navigation }) => {
  const { params = {} } = navigation.state

  return {
    headerStyle: HeaderStyle.default,
    headerTitle: navigation.getParam('title', 'Products'),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Products)
