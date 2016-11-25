import React, {
	PropTypes
} from 'react'
import {
	bindActionCreators
} from 'redux'
import {
	connect
} from 'react-redux'
import * as Actions from '../actions'
import {
	Button,
	Select,
	Input,
	Mention,
	message
} from 'antd'
import {Awesome} from '../components/Awesome'
import { browserHistory, Link } from 'react-router'

const Option = Select.Option
const { toString } = Mention

const style = {
	body: {
		width: '90%',
		backgroundColor: '#fff',
		margin: '10px auto',
		borderRadius: '8px'
	},
	title: {
		backgroundColor: '#f6f6f6',
		borderRadius: '8px 8px 0 0',
		width: '100%',
		height: '40px',
		fontSize: '14px',
		lineHeight: '40px',
		paddingLeft: '5px'
	},
	content: {
		padding: '10px',
		borderTop: '1px solid #e5e5e5'
	},
	there: {
		color: '#999'
	},
	input_title: {
		width: '95%',
		margin: '0 auto 15px'
	},
	submit: {
		marginTop: '30px'
	}
}

export class Message extends React.Component {

	state = {
		select: '',
		title: '',
		content: ''
	}

	componentWillReceiveProps = (nextProps) => {
	    const createNow = this.props.state.cnode.create
	    const createNext = nextProps.state.cnode.create
	    if( createNow !== createNext && createNext==='success' ) {
	    	message.success('创建成功')
	    	browserHistory.push('/')
	    }
	    if( createNow !== createNext && createNext==='fail' ) {
	    	message.error('创建失败(当前操作一天可以进行七次)')
	    }
	}

	handleSlecet = (value) => {
		this.setState({
			select: value
		})
	}
	handleInput = (e) => {
		let title = e.target.value
		this.setState({
			title: title
		})
	}
	handleContent = (content) => {
		this.setState({
			content: toString(content)
		})
	}

	handleSubmit = () => {
		const acc = localStorage.getItem("loginname") || ''
		let data = {
			accesstoken: acc,
			title: this.state.title,
			tab: this.state.select,
			content: this.state.content
		}
		this.props.actions.createTopic(data)
	}

	render() {
		const {
			actions,
			state
		} = this.props
		console.log(actions, state)
		return (
			<div style={style.body}>
				<p style={style.title}><Link to={`/`}>主页</Link><span style={style.there}>/&nbsp;发布话题</span></p>
				<form id="create_topic" onSubmit={this.handleSubmit} style={style.content} >
					<span>选择板块：</span>
					<Select size='large' defaultValue='' style={{ width: 200, marginBottom: 10, marginLeft: 10 }} onChange={this.handleSlecet}>
					  <Option value='' disabled>请选择</Option>
				      <Option value='share'>分享</Option>
				      <Option value='ask'>问答</Option>
				      <Option value='job'>招聘</Option>
				    </Select>
				    {this.state.select==='ask' ? <strong style={style.remind}>提问时，请遵循<a href="https://gist.github.com/alsotang/f654af8b1fff220e63fcb44846423e6d">《提问的智慧》</a>中提及的要点，以便您更接收到高质量回复。</strong> : ''}
				    {this.state.select==='job' ? <strong>为避免被管理员删帖，发帖时请好好阅读<a href="http://cnodejs.org/topic/541ed2d05e28155f24676a12">《招聘帖规范》</a></strong> : ''}
				    <Input style={style.input_title} value={this.state.title} onChange={this.handleInput} placeholder='标题字数 十字以上' />
					<Awesome handleContent={this.handleContent}/>
					<Button disabled={this.state.select==='' || this.state.title.length<10 || this.state.content.length<1 } style={style.submit} type="primary" onClick={this.handleSubmit}>提交</Button>
				</form>
			</div>
		);
	}
}

Message.propTypes = {
	actions: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
	state: state
})

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators(Actions, dispatch)
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Message)