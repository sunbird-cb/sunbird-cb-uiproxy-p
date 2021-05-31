import _ from 'lodash'
// tslint:disable
const contentMapper = {
	Collection: 'CourseUnit',
	CourseUnit: 'Collection',
}

/**
 * [This function is used for altering the request and response structure based on keys]
 * @param  {[json]} data      [Mandatory]
 * @param  {[string]} masterObjectKey [First Level Key]
 * @return {[json]}         [description]
 */
export function returnData(data: any, masterObjectKey: any = null, level = 'flat') {
	if (_.isEmpty(data)) {
		return false
	}

	let responseData: any = ''
	switch (level) {
		case 'hierarchy':
			responseData = hierarchy(data)
			break

		default:
			const dataToAlter = data[masterObjectKey]
			const modifiedData = alterData(dataToAlter)
			data[masterObjectKey] = modifiedData
			responseData = data
			break
	}

	return responseData
}

/**
 * [This function is used for handling hierarchy]
 * @param  {[json]} data      [Mandatory]
 * @return {[json]}         [description]
 */
export function hierarchy(data: any = null) {
	const alData = data.request.data.hierarchy
	for (const property in alData) {
		switch (alData[property].contentType) {
			case 'Collection':
				data.request.data.hierarchy[property].contentType = contentMapper[data.request.data.hierarchy[property].contentType]
				break

			case 'CourseUnit':
				data.request.data.hierarchy[property].contentType = contentMapper[data.request.data.hierarchy[property].contentType]
				break

			default:
				break
		}
	}

	return data
}

/**
 * [This function is used for handling flat level object]
 * @param  {[json]} request      [Mandatory]
 * @return {[json]}         [description]
 */
export function alterData(request: any = null) {
	if (request == null) {
	  return false
	}

	const contentType = request.content.contentType
	switch (contentType) {
		case 'Collection':
		  request.content.contentType = contentMapper[contentType]
		  break

		case 'CourseUnit':
		  request.content.contentType = contentMapper[contentType]
		  break

	   default:
		  break
	}
	return request
}
// tslint:enable

// module.exports =
// {
// 	returnData
// };
