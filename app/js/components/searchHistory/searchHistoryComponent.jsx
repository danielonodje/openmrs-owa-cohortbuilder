import React, {Component} from 'react';
import shortId from 'shortid';
import { ApiHelper } from '../../helpers/apiHelper';
import { JSONHelper } from '../../helpers/jsonHelper';

import './searchHistory.css';

class SearchHistoryComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchHistory : [],
            searchResults: [],
            currentPage: 1,
            toDisplay: [],
            totalPage: 0,
            perPage: 10,
            description: ''
        };
        this.navigatePage = this.navigatePage.bind(this);
    }

    navigatePage(event) {
        event.preventDefault();
        let pageToNavigate = 0;
        switch(event.target.value) {
            case 'first': pageToNavigate = 1; break;
            case 'last': pageToNavigate = this.state.totalPage; break;
            default: pageToNavigate = (event.target.value === 'next') ? this.state.currentPage+1 : this.state.currentPage-1;
        }
        const pagePatientInfo = this.getPagePatient(this.state.searchResults, pageToNavigate);
        this.setState({ toDisplay: pagePatientInfo, currentPage: pageToNavigate });
    }

    viewResult(index) {
        return (event) => {
            event.preventDefault();
            const allPatients = this.props.history[index].patients;
            const pagePatientInfo = this.getPagePatient(allPatients, 1);
            const description = this.props.history[index].description;
            this.setState({
                toDisplay: pagePatientInfo,
                searchResults: allPatients,
                description,
                totalPage: Math.ceil(allPatients.length/this.state.perPage),
                currentPage: 1,
            });
        };
    }

    getPagePatient(allPatients, currentPage) {
        const pagePatientInfo = [];
        for(let index = (currentPage-1) * this.state.perPage; index < currentPage * this.state.perPage && index < allPatients.length; index++) {
            pagePatientInfo.push(
                allPatients[index]
            );
        }
        return pagePatientInfo;
    }

    delete(index) {
        return (event) => {
            event.preventDefault();
            this.props.deleteHistory(index);
        };
    }

    render(){
        return (
            <div className="col-sm-12 section">
                <h3>Search History</h3>
                <div className="result-window">
                    {
                        (this.props.history.length > 0) ?
                            <table className="table table-hover">
                                <tbody>
                                    {
                                        this.props.history.map((eachResult, index) =>
                                            <tr key={shortId.generate()}>
                                                <td>{this.props.history.length - index}</td>
                                                <td>{eachResult.description}</td>
                                                <td>{eachResult.patients.length +' result(s)'}</td>
                                                <td><span className="glyphicon glyphicon-floppy-disk save" title="Save" aria-hidden="true"/></td>
                                                <td><span className="glyphicon glyphicon glyphicon-remove remove" title="Remove" onClick={this.delete(index)} aria-hidden="true"/></td>
                                                <td><span className="glyphicon glyphicon-eye-open view" onClick={this.viewResult(index)} title="View" aria-hidden="true"/></td>
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </table>
                            : <p className="text-center">No search History</p>
                    }
                </div>

                {(this.state.searchResults.length) ? 
                <div className="result row col-sm-8 col-sm-offset-2">
                    <h2 className="center-align">{this.state.description}</h2>
                    <table className="table table-striped" >
                        <thead>
                            <tr>
                                <td>NAME</td>
                                <td>AGE</td>
                                <td>GENDER</td>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            this.state.toDisplay.map(patient => {
                                return (
                                    <tr key={shortId.generate()}>
                                        <td>{`${patient.firstname} ${patient.lastname}`}</td>
                                        <td>{patient.age}</td>
                                        <td>{patient.gender}</td>
                                    </tr>);
                            })
                        }
                        </tbody>
                    </table>
                    
                    <div className="tableNavigation">
                        <button className="btn btn-primary" onClick={this.navigatePage} value="first">FIRST</button>
                        {
                            (this.state.currentPage > 1) ?
                                <button className="btn btn-primary" onClick={this.navigatePage} value="previous">PREVIOUS</button> :
                                null
                        }

                        {
                            (this.state.currentPage < this.state.totalPage) ?
                                <span>
                                    <button className="btn btn-primary" onClick={this.navigatePage} value="next">NEXT</button>
                                    <button className="btn btn-primary" onClick={this.navigatePage} value="last">LAST</button>
                                </span> :
                                null
                        }
                        <span className="page-display-counter">{this.state.currentPage + " of " + this.state.totalPage}</span>
                    </div>
                </div> :
                null
            }
            </div>
        );
    }
}

SearchHistoryComponent.propTypes = {
    history: React.PropTypes.array.isRequired,
    deleteHistory: React.PropTypes.func.isRequired
};

export default SearchHistoryComponent;
