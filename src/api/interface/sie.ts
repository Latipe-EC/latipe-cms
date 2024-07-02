export interface SIEResponse {
	data: DataSIE[]
	code: number
	message: string
}

export interface DataSIE {
	id: string
	product_id: string
	product_name: string
	image_urls: string[]
}