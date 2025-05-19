import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from "react-router-dom";
import { Suspense } from "react";
import Dashboard from "../pages/dashboard-page/dashboard";
import Header from "../layouts/header/header";
import Login from "../pages/Login/login";
import Channel from "../pages/customer/Channel";
import FamilyCode from "../pages/customer/FamilyCode";
import Industry from "../pages/customer/Industry";
import IntermediaryCode from "../pages/customer/IntermediaryCode";
import OccupationType from "../pages/customer/OccupationType";
import PermanentAddress from "../pages/customer/PermanentAddress";
import ProductSegment from "../pages/customer/ProductSegment";
import State from "../pages/customer/State";
import Tag from "../pages/customer/Tag";
import UserCode from "../pages/customer/UserCode";
import AdminUser from "../pages/Master/AdminUsers/AdminUser";
import NetworthProof from "../pages/customer/NetworthProof";
import PEPClassificationEnum from "../pages/customer/PEPClassificationEnum";
import CKYCAddressType from "../pages/customer/CKYCAddressType";
import Adminuserrights from "../pages/Adminuserrights/Adminuserrights";
import Relation from "../pages/customer/Relation";
import RegAMLSpecialCategory from "../pages/customer/RegAMLSpecialCategory";
import CorrespondenceAddressProof from "../pages/customer/CorrespondenceAddressProof";
import CardSubType from "../pages/transaction/CardSubType";
import Currency from "../pages/customer/Currency";
import IncomeProof from "../pages/customer/IncomeProof";
import IncomeRange from "../pages/customer/IncomeRange";
import IUPartyType from "../pages/customer/IUPartyType";
import PEP from "../pages/customer/PEP";
import ReputationClassification from "../pages/customer/reputationClassification";
import ProofOfIDSubmitted from "../pages/customer/ProofOfIDSubmitted";
import ModuleApplicable from "../pages/customer/ModuleApplicable";
import RegulatoryAMLRisk from "../pages/customer/RegulatoryAMLRisk";
import KYCAttesation from "../pages/customer/KYCAttesation";
import RMType from "../pages/customer/RMType";
import ActivitySector from "../pages/customer/ActivitySector";
import InsiderInformation from "../pages/customer/InsiderInformation";
import Gender from "../pages/customer/Gender";
import MaritalStatus from "../pages/customer/MaritalStatus";
import NatureOfBusiness from "../pages/customer/NatureOfBusiness";
import AdverseMediaClassification from "../pages/customer/AdverseMediaClassification";
import CustomerRelatedPartyStatus from "../pages/customer/CustomerRelatedPartyStatus";
import Qualification from "../pages/customer/Qualification";
import CustomerSubType from "../pages/customer/CustomerSubType";
import Country from "../pages/customer/Country";
import Attachment from "../pages/customer/Attachment";
import Segment from "../pages/customer/Segment";
import CardType from "../pages/transaction/CardType";
import ClientBankCode from "../pages/transaction/ClientBankCode";
import OriginalCurrency from "../pages/transaction/OriginalCurrency";
import SourceOfFund from "../pages/transaction/SourceOfFund";
import CustomerType from "../pages/customer/CustomerType";
import Type2 from "../pages/transaction/Type2";
import VoucherType from "../pages/transaction/VoucherType";
import RegAMLRisk from "../pages/account/RegAMLRisk";
import ClientStatus from "../pages/account/ClientStatus";
import NatureOfCredit from "../pages/account/NatureOfCredit";
import LendingArrangement from "../pages/account/LendingArrangement";
import InsurancePurpose from "../pages/account/InsurancePurpose";
import IsDefaulted from "../pages/account/IsDefaulted";
import ReasonCode from "../pages/account/ReasonCode";
import ProductAccountStatus from "../pages/account/ProductAccountStatus";
import DebtSubType from "../pages/account/DebtSubType";
import FundedType from "../pages/account/FundedType";
import PolicyType from "../pages/account/PolicyType";
import InstrumentType from "../pages/account/InstrumentType";
import PermanentCKYCAddressType from "../pages/account/PermanentCKYCAddressType";
import AccountSegment from "../pages/account/AccountSegment";
import ProductAccountType from "../pages/transaction/ProductAccountType";
import CaseSearch from "../pages/Search/caseSearch";
import Level1FirstReview from "../pages/LevelSearch/Level1FirstReview";
import LevelFlow from "../pages/LevelSearch/LevelFlow";
import Admin from "../pages/Master/Admin/admin";
import Client from "../pages/Master/Client/Client";
import CaseDetail from "../pages/CaseDetail/caseDetail";
import MoneyFlow from "../pages/MoneyFlow/MoneyFlow";
import Suspicion from "../pages/GroundofSuspicion/Suspicion";
import Cases from "../pages/Cases/Cases";
import Relations from "../pages/Relation/Relations";
import TaskAssign from "../pages/TaskAssign/TaskAssign";
import CustomerDetails from "../pages/CustomerDetails/CustomerDetails";
import Alert from "../pages/Alert/Alert";
import CaseManager from "../pages/CaseManager/caseManager";
import ExcelUpload from "../pages/ExcelFileUpload/ExcelUpload";
import ScenarioList from "../pages/ScenarioList/ScenarioList";
import ExcelFileView from "../pages/ExcelFileUpload/ExcelFileView";
import Loader from "../pages/loader/loader";
import ScenarioConfig from "../pages/ScenarioList/ScenarioConfig";
import ScenarioGeneration from "../pages/ScenarioList/ScenarioGeneration";
import ScenarioReport from "../pages/report/ScenarioReport";
import ConfigParameter from "../pages/configparameter/ConfigParameter";
import PieChartView from "../pages/pieChart/pieChartView";
import ExcelButton from "../pages/ExcelFileUpload/ExcelButton";

const AppRouter = () => {

    const isAuthenticated = () => {
        const loginDetails = sessionStorage.getItem('loginDetails') || localStorage.getItem('loginDetails');
        return loginDetails !== null;
    };

    return (
        <Suspense fallback={<span>Loading....</span>}>
            <Router>
                <Routes>

                    <Route
                        path="/"
                        element={
                            isAuthenticated() ? (
                                <Outlet />
                            ) : (
                                <Navigate to="/login" />
                            )
                        }
                    />
                    {/* Unprotected Route */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<Outlet />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/header" element={<Header />} />
                        <Route path="/Adminuserrights" element={<Adminuserrights />} />
                        <Route path="/AdminUser" element={<AdminUser />} />
                        {/* customer */}  {/*uma*/}
                        <Route path="/Channel" element={<Channel />} />
                        <Route path="/FamilyCode" element={<FamilyCode />} />
                        <Route path="/Industry" element={<Industry />} />
                        <Route path="/IntermediaryCode" element={<IntermediaryCode />} />
                        <Route path="/OccupationType" element={<OccupationType />} />
                        <Route path="/PermanentAddress" element={<PermanentAddress />} />
                        <Route path="/ProductSegment" element={<ProductSegment />} />
                        <Route path="/State" element={< State />} />
                        <Route path="/Tag" element={< Tag />} />
                        <Route path="/UserCode" element={< UserCode />} />
                        <Route path="/NetworthProof" element={<NetworthProof />} />
                        <Route path="/PEPClassificationEnum" element={<PEPClassificationEnum />} />
                        <Route path="/CKYCAddressType" element={<CKYCAddressType />} />
                        <Route path="/Relation" element={<Relation />} />
                        <Route path="/RegAMLSpecialCategory" element={<RegAMLSpecialCategory />} />
                        <Route path="/CorrespondenceAddressProof" element={<CorrespondenceAddressProof />} />
                        <Route path="/CustomerType" element={<CustomerType />} />
                        {/* Ashika */}
                        <Route path="/Currency" element={<Currency />} />
                        <Route path="/IncomeProof" element={<IncomeProof />} />
                        <Route path="/IncomeRange" element={<IncomeRange />} />
                        <Route path="/IUPartyType" element={<IUPartyType />} />
                        <Route path="/PEP" element={<PEP />} />
                        <Route path="/RMType" element={<RMType />} />
                        <Route path="/ReputationClassification" element={<ReputationClassification />} />
                        <Route path="/ProofOfIDSubmitted" element={<ProofOfIDSubmitted />} />
                        <Route path="/ModuleApplicable" element={<ModuleApplicable />} />
                        <Route path="/RegulatoryAMLRisk" element={<RegulatoryAMLRisk />} />
                        <Route path="/KYCAttesation" element={<KYCAttesation />} />
                        {/* raji */}
                        <Route path="/ActivitySector" element={<ActivitySector />} />
                        <Route path="/InsiderInformation" element={<InsiderInformation />} />
                        <Route path="/Gender" element={<Gender />} />
                        <Route path="/MaritalStatus" element={<MaritalStatus />} />
                        <Route path="/NatureOfBusiness" element={<NatureOfBusiness />} />
                        <Route path="/AdverseMediaClassification" element={<AdverseMediaClassification />} />
                        <Route path="/Segment" element={<Segment />} />
                        <Route path="/CustomerRelatedPartyStatus" element={<CustomerRelatedPartyStatus />} />
                        <Route path="/Qualification" element={<Qualification />} />
                        <Route path="/Attachment" element={<Attachment />} />
                        <Route path="/CustomerSubType" element={<CustomerSubType />} />
                        <Route path="/Country" element={<Country />} />
                        {/* Transaction */}   {/*uma*/}
                        <Route path="/CardSubType" element={<CardSubType />} />
                        <Route path="/CardType" element={<CardType />} />
                        <Route path="/ClientBankCode" element={<ClientBankCode />} />
                        <Route path="/OriginalCurrency" element={<OriginalCurrency />} />
                        <Route path="/SourceOfFund" element={<SourceOfFund />} />
                        <Route path="/ProductAccountType" element={<ProductAccountType />} />
                        <Route path="/Type2" element={<Type2 />} />
                        <Route path="/VoucherType" element={<VoucherType />} />
                        {/* Account */}{/* Ashika */}
                        <Route path="/RegAMLRisk" element={<RegAMLRisk />} />
                        <Route path="/ClientStatus" element={<ClientStatus />} />
                        <Route path="/NatureOfCredit" element={<NatureOfCredit />} />
                        <Route path="/LendingArrangement" element={<LendingArrangement />} />
                        <Route path="/InsurancePurpose" element={<InsurancePurpose />} />
                        <Route path="/IsDefaulted" element={<IsDefaulted />} />
                        <Route path="/ReasonCode" element={<ReasonCode />} />
                        <Route path="/ProductAccountStatus" element={<ProductAccountStatus />} />
                        <Route path="/DebtSubType" element={<DebtSubType />} />
                        <Route path="/FundedType" element={<FundedType />} />
                        <Route path="/PolicyType" element={<PolicyType />} />
                        <Route path="/InstrumentType" element={<InstrumentType />} />
                        <Route path="/PermanentCKYCAddressType" element={<PermanentCKYCAddressType />} />
                        <Route path="/AccountSegment" element={<AccountSegment />} />
                        <Route path="/caseSearch" element={<CaseSearch />} />
                        <Route path="/level1FirstReview" element={<Level1FirstReview />} />
                        {/* <Route path="/level1SecReview" element={<Level1SecReview />} /> */}
                        <Route path="/levelflow" element={<LevelFlow />} />
                        <Route path="/admin" element={<Admin />} />
                        <Route path="/client" element={<Client />} />
                        <Route path="/caseDetail" element={<CaseDetail />} />
                        <Route path="/moneyFlow" element={<MoneyFlow />} />
                        <Route path="/suspicion" element={<Suspicion />} />
                        <Route path="/cases" element={<Cases />} />
                        <Route path="/relations" element={<Relations />} />
                        <Route path="/taskAssign" element={<TaskAssign />} />
                        <Route path="/CustomerDetails" element={<CustomerDetails />} />
                        <Route path="/CustomerDetails/:customerId/:accountId/:hitId" element={<CustomerDetails />} />
                        <Route path="/Alert" element={<Alert />} />
                        <Route path="/CaseManager" element={<CaseManager />} />
                        <Route path="/ExcelUpload" element={<ExcelUpload />} />
                        <Route path="/ScenarioList" element={<ScenarioList />} />
                        <Route path="/ExcelFileView" element={<ExcelFileView />} />
                        <Route path="/loader" element={<Loader />} />
                        <Route path="/ScenarioConfig" element={<ScenarioConfig />} />
                        <Route path="/ScenarioGeneration" element={<ScenarioGeneration />} />
                        <Route path="/Report" element={<ScenarioReport />} />
                        <Route path="/ConfigParameter" element={<ConfigParameter />} />
                        <Route path="/PieChartView" element={<PieChartView />} />
                        <Route path="/ExcelButton" element={<ExcelButton />} />
                    </Route>
                </Routes>
            </Router>
        </Suspense>
    );
};

export default AppRouter;